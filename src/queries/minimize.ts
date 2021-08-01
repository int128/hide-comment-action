import { GitHub } from '@actions/github/lib/utils'
import { MinimizeCommentMutation, MinimizeCommentMutationVariables } from '../generated/graphql'

type Octokit = InstanceType<typeof GitHub>

const query = /* GraphQL */ `
  mutation minimizeComment($id: ID!) {
    minimizeComment(input: { classifier: OUTDATED, subjectId: $id }) {
      clientMutationId
    }
  }
`

export const minimizeComment = async (
  o: Octokit,
  v: MinimizeCommentMutationVariables
): Promise<MinimizeCommentMutation> => {
  return await o.graphql<MinimizeCommentMutation>(query, v)
}
