import * as core from '@actions/core'
import { run } from './run'

const main = async (): Promise<void> => {
  try {
    await run({
      authors: core.getMultilineInput('authors', { required: true }),
      startsWith: core.getMultilineInput('starts-with', { required: true }),
      token: core.getInput('token', { required: true }),
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
