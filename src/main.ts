import * as core from '@actions/core'
import { run } from './run'

const main = async (): Promise<void> => {
  await run({
    authors: core.getMultilineInput('authors'),
    startsWith: core.getMultilineInput('starts-with'),
    endsWith: core.getMultilineInput('ends-with'),
    contains: core.getMultilineInput('contains'),
    issueNumber: issueNumber(core.getInput('issue-number')),
    token: core.getInput('token', { required: true }),
  })
}

const issueNumber = (s: string): number | undefined => {
  if (!s) {
    return undefined
  }

  const n = parseInt(s)
  if (Number.isNaN(n)) {
    throw new Error('issue-number is an invalid number')
  }
  if (!Number.isSafeInteger(n)) {
    throw new Error('issue-number is not a safe integer')
  }

  return n
}

main().catch((e: Error) => {
  core.setFailed(e)
  console.error(e)
})
