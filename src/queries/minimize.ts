import type { Octokit } from '@octokit/action'
import type { MinimizeCommentMutation, MinimizeCommentMutationVariables } from '../generated/graphql.js'

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
