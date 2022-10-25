import * as core from '@actions/core'
import * as github from '@actions/github'
import { CommentsQuery } from './generated/graphql'
import { IssueComment } from './generated/graphql-types'
import { queryComments } from './queries/comments'
import { minimizeComment } from './queries/minimize'

type Inputs = {
  authors: string[]
  startsWith: string[]
  endsWith: string[]
  contains: string[]
  token: string
}

export const run = async (inputs: Inputs): Promise<void> => {
  if (github.context.payload.pull_request === undefined) {
    core.info(`non pull_request event: ${github.context.eventName}`)
    return
  }
  const octokit = github.getOctokit(inputs.token)

  core.info(`query comments in pull request ${github.context.payload.pull_request.html_url ?? '?'}`)
  const q = await queryComments(octokit, {
    owner: github.context.repo.owner,
    name: github.context.repo.repo,
    number: github.context.payload.pull_request.number,
  })

  const filteredComments = filterComments(q, inputs)
  for (const c of filteredComments) {
    core.info(`minimize comment ${c.url}`)
    await minimizeComment(octokit, { id: c.id })
  }
}

type Comment = NonNullable<
  NonNullable<
    NonNullable<NonNullable<NonNullable<CommentsQuery['repository']>['pullRequest']>['comments']>['nodes']
  >[number]
>

const filterComments = (q: CommentsQuery, inputs: Inputs) => {
  if (q.repository?.pullRequest?.comments.nodes == null) {
    core.info(`unexpected response: repository === ${JSON.stringify(q.repository)}`)
    return []
  }
  const comments = []
  for (const node of q.repository.pullRequest.comments.nodes) {
    if (node == null) {
      continue
    }
    comments.push(node)
  }
  return comments.filter((c) => toMinimize(c, inputs))
}

export const toMinimize = (c: Comment, inputs: Inputs): boolean => {
  if (c.isMinimized) {
    return false
  }
  if (inputs.authors.some((a) => c.author?.login === a)) {
    core.info(`authors filter matched: ${c.url}`)
    return true
  }
  if (inputs.startsWith.some((s) => c.body.trimStart().startsWith(s))) {
    core.info(`starts-with matched: ${c.url}`)
    return true
  }
  if (inputs.endsWith.some((s) => c.body.trimEnd().endsWith(s))) {
    core.info(`ends-with matched: ${c.url}`)
    return true
  }
  if (inputs.contains.some((s) => c.body.includes(s))) {
    core.info(`contains matched: ${c.url}`)
    return true
  }
  return false
}
