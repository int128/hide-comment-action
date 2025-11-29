import * as core from '@actions/core'
import type { Octokit } from '@octokit/action'
import { filterComments } from './filter.js'
import type { Context } from './github.js'
import { queryComments } from './queries/comments.js'
import { minimizeComment } from './queries/minimize.js'

type Inputs = {
  authors: string[]
  startsWith: string[]
  endsWith: string[]
  contains: string[]
  issueNumber?: number
}

export const run = async (inputs: Inputs, octokit: Octokit, context: Context): Promise<void> => {
  const pullNumber = inputs.issueNumber ?? inferPullNumber(context)
  if (pullNumber === undefined) {
    core.info(`non pull_request event: ${context.eventName}`)
    return
  }

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
      owner: context.repo.owner,
      name: context.repo.repo,
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

const inferPullNumber = (context: Context): number | undefined => {
  if ('pull_request' in context.payload) {
    return context.payload.pull_request.number
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
