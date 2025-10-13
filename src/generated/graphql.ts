import type * as Types from './graphql-types.js'

export type CommentsQueryVariables = Types.Exact<{
  owner: Types.Scalars['String']['input']
  name: Types.Scalars['String']['input']
  number: Types.Scalars['Int']['input']
}>

export type CommentsQuery = {
  __typename?: 'Query'
  repository?: {
    __typename?: 'Repository'
    pullRequest?: {
      __typename?: 'PullRequest'
      comments: {
        __typename?: 'IssueCommentConnection'
        nodes?: Array<{
          __typename?: 'IssueComment'
          id: string
          url: string
          body: string
          isMinimized: boolean
          author?:
            | { __typename?: 'Bot'; login: string }
            | { __typename?: 'EnterpriseUserAccount'; login: string }
            | { __typename?: 'Mannequin'; login: string }
            | { __typename?: 'Organization'; login: string }
            | { __typename?: 'User'; login: string }
            | null
        } | null> | null
      }
    } | null
  } | null
}

export type MinimizeCommentMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input']
}>

export type MinimizeCommentMutation = {
  __typename?: 'Mutation'
  minimizeComment?: { __typename?: 'MinimizeCommentPayload'; clientMutationId?: string | null } | null
}
