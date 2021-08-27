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
  token: string
}

export const run = async (inputs: Inputs): Promise<void> => {
  if (github.context.payload.pull_request === undefined) {
    core.info(`non pull_request event: ${github.context.eventName}`)
    return
  }
  const octokit = github.getOctokit(inputs.token)

  core.info(`query comments in pull request ${github.context.payload.pull_request.html_url ?? '?'}`)
  const comments = await queryComments(octokit, {
    owner: github.context.repo.owner,
    name: github.context.repo.repo,
    number: github.context.payload.pull_request.number,
  })

  const filteredComments = filterComments(comments, inputs)
  for (const c of filteredComments) {
    core.info(`minimize comment ${JSON.stringify(c.url)}`)
    await minimizeComment(octokit, { id: c.id })
  }
}

type Comment = Pick<IssueComment, 'id' | 'url' | 'isMinimized' | 'author' | 'body'>

const filterComments = (q: CommentsQuery, inputs: Inputs): Comment[] => {
  if (q.repository?.pullRequest?.comments.nodes == null) {
    core.info(`unexpected response: repository === ${JSON.stringify(q.repository)}`)
    return []
  }
  const comments = q.repository.pullRequest.comments.nodes.filter((c) => c != null) as Comment[]
  return comments.filter((c) => toMinimize(c, inputs))
}

export const toMinimize = (c: Comment, inputs: Inputs): boolean => {
  if (c.isMinimized) {
    return false
  }
  if (inputs.authors.some((a) => c.author?.login === a)) {
    core.info(`authors filter matched: ${JSON.stringify(c.url)}`)
    return true
  }
  if (inputs.startsWith.some((s) => c.body.trimStart().startsWith(s))) {
    core.info(`starts-with matched: ${JSON.stringify(c.url)}`)
    return true
  }
  if (inputs.endsWith.some((s) => c.body.trimEnd().endsWith(s))) {
    core.info(`ends-with matched: ${JSON.stringify(c.url)}`)
    return true
  }
  return false
}
