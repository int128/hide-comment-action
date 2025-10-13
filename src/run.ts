import * as core from '@actions/core'
import { filterComments } from './filter.js'
import * as github from './github.js'
import { queryComments } from './queries/comments.js'
import { minimizeComment } from './queries/minimize.js'

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

const getCurrentLogin = async (octokit: github.Octokit) => {
  try {
    const { data: user } = await octokit.rest.users.getAuthenticated()
    return user.login
  } catch (e) {
    core.warning(`could not determine the current user: ${String(e)}`)
    return 'github-actions'
  }
}
