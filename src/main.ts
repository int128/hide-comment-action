import * as core from '@actions/core'
import { run } from './run'

const main = async (): Promise<void> => {
  try {
    await run({
      authors: core.getMultilineInput('authors'),
      startsWith: core.getMultilineInput('starts-with'),
      endsWith: core.getMultilineInput('ends-with'),
      token: core.getInput('token', { required: true }),
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
