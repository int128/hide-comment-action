import * as github from '@actions/github'
import { MinimizeCommentMutation, MinimizeCommentMutationVariables } from '../generated/graphql.js'

type Octokit = ReturnType<typeof github.getOctokit>

const query = /* GraphQL */ `
  mutation minimizeComment($id: ID!) {
    minimizeComment(input: { classifier: OUTDATED, subjectId: $id }) {
      clientMutationId
    }
  }
`

export const minimizeComment = async (
  o: Octokit,
  v: MinimizeCommentMutationVariables,
): Promise<MinimizeCommentMutation> => {
  return await o.graphql<MinimizeCommentMutation>(query, v)
}
