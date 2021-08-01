import { GitHub } from '@actions/github/lib/utils'
import { CommentsQuery, CommentsQueryVariables } from '../generated/graphql'

type Octokit = InstanceType<typeof GitHub>

const query = /* GraphQL */ `
  query comments($owner: String!, $name: String!, $number: Int!) {
    repository(owner: $owner, name: $name) {
      pullRequest(number: $number) {
        comments(last: 100, orderBy: { field: UPDATED_AT, direction: DESC }) {
          nodes {
            id
            url
            author {
              login
            }
            body
            isMinimized
          }
        }
      }
    }
  }
`

export const queryComments = async (o: Octokit, v: CommentsQueryVariables): Promise<CommentsQuery> => {
  return await o.graphql<CommentsQuery>(query, v)
}
