import * as core from '@actions/core'
import { CommentsQuery } from './generated/graphql.js'

type Inputs = {
  authors: string[]
  startsWith: string[]
  endsWith: string[]
  contains: string[]
}

export type Comment = NonNullable<
  NonNullable<
    NonNullable<NonNullable<NonNullable<CommentsQuery['repository']>['pullRequest']>['comments']>['nodes']
  >[number]
>

export const filterComments = (q: CommentsQuery, inputs: Inputs): Comment[] => {
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
