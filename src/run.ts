import * as core from '@actions/core'
import * as github from '@actions/github'
import { CommentsQuery } from './generated/graphql'
import { IssueComment } from './generated/graphql-types'
import { queryComments } from './queries/comments'
import { minimizeComment } from './queries/minimize'

type Inputs = {
  authors: string[]
  startsWith: string[]
  token: string
}

export const run = async (inputs: Inputs): Promise<void> => {
  if (github.context.payload.pull_request === undefined) {
    core.info(`non pull_request event: ${github.context.eventName}`)
    return
  }
  const octokit = github.getOctokit(inputs.token)

  core.info(`query comments in pull request ${github.context.payload.pull_request.html_url}`)
  const comments = await queryComments(octokit, {
    owner: github.context.repo.owner,
    name: github.context.repo.repo,
    number: github.context.payload.pull_request.number,
  })

  const filteredComments = filterComments(comments, inputs)
  for (const c of filteredComments) {
    core.info(`minimize comment ${c.url}`)
    await minimizeComment(octokit, { id: c.id })
  }
}

type FilteredComment = Pick<IssueComment, 'id' | 'url'>

const filterComments = (q: CommentsQuery, inputs: Inputs): FilteredComment[] => {
  if (q.repository?.pullRequest?.comments.nodes == null) {
    core.info(`unexpected response: repository === ${q.repository}`)
    core.info(`unexpected response: repository.pullRequest === ${q.repository?.pullRequest}`)
    return []
  }

  const f: FilteredComment[] = []
  for (const c of q.repository.pullRequest.comments.nodes) {
    if (c === null) {
      continue
    }
    if (c.isMinimized) {
      continue
    }

    if (inputs.authors.length > 0) {
      if (!inputs.authors.some((a) => c.author?.login === a)) {
        core.info(`authors did not match: ${c.url}`)
        continue
      }
    }
    if (inputs.startsWith.length > 0) {
      if (!inputs.startsWith.some((s) => c.body.startsWith(s))) {
        core.info(`starts-with did not match: ${c.url}`)
        continue
      }
    }

    f.push(c)
  }
  return f
}
