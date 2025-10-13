import type { MinimizeCommentMutation, MinimizeCommentMutationVariables } from '../generated/graphql.js'
import type * as github from '../github.js'

const query = /* GraphQL */ `
  mutation minimizeComment($id: ID!) {
    minimizeComment(input: { classifier: OUTDATED, subjectId: $id }) {
      clientMutationId
    }
  }
`

export const minimizeComment = async (
  o: github.Octokit,
  v: MinimizeCommentMutationVariables,
): Promise<MinimizeCommentMutation> => {
  return await o.graphql<MinimizeCommentMutation>(query, v)
}
