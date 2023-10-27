import * as core from '@actions/core'
import * as github from '@actions/github'
import { GitHub } from '@actions/github/lib/utils'
import { CommentsQuery } from './generated/graphql'
import { queryComments } from './queries/comments'
import { minimizeComment } from './queries/minimize'

type Octokit = InstanceType<typeof GitHub>

type Inputs = {
  authors: string[]
  startsWith: string[]
  endsWith: string[]
  contains: string[]
  issueNumber?: number
  token: string
}

export const run = async (inputs: Inputs): Promise<void> => {
  const pullNumber = inputs.issueNumber ?? github.context.payload.pull_request?.number
  if (pullNumber === undefined) {
    core.info(`non pull_request event: ${github.context.eventName}`)
    return
  }
  const octokit = github.getOctokit(inputs.token)

  if (
    inputs.authors.length === 0 &&
    inputs.contains.length === 0 &&
    inputs.startsWith.length === 0 &&
    inputs.endsWith.length === 0
  ) {
    const login = await getCurrentLogin(octokit)
    core.info(`no condition is given, hide comments created by user ${login}`)
    inputs.authors = [login]
  }

  const q = await core.group(`query comments in pull request #${pullNumber}`, async () => {
    const q = await queryComments(octokit, {
      owner: github.context.repo.owner,
      name: github.context.repo.repo,
      number: pullNumber,
    })
    core.info(JSON.stringify(q, undefined, 2))
    return q
  })

  core.info(
    `Filter comments by conditions: ${JSON.stringify(
      {
        authors: inputs.authors,
        startsWith: inputs.startsWith,
        endsWith: inputs.endsWith,
        contains: inputs.contains,
      },
      undefined,
      2,
    )}`,
  )
  const filteredComments = filterComments(q, inputs)
  for (const c of filteredComments) {
    core.info(`minimize comment ${c.url}`)
    await minimizeComment(octokit, { id: c.id })
  }
}

const getCurrentLogin = async (octokit: Octokit) => {
  try {
    const { data: user } = await octokit.rest.users.getAuthenticated()
    return user.login
  } catch (e) {
    core.warning(`could not determine the current user: ${String(e)}`)
    return 'github-actions'
  }
}

type Comment = NonNullable<
  NonNullable<
    NonNullable<NonNullable<NonNullable<CommentsQuery['repository']>['pullRequest']>['comments']>['nodes']
  >[number]
>

const filterComments = (q: CommentsQuery, inputs: Inputs): Comment[] => {
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
