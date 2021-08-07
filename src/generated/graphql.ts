import * as Types from './graphql-types';

export type CommentsQueryVariables = Types.Exact<{
  owner: Types.Scalars['String'];
  name: Types.Scalars['String'];
  number: Types.Scalars['Int'];
}>;


export type CommentsQuery = { __typename?: 'Query', repository?: Types.Maybe<{ __typename?: 'Repository', pullRequest?: Types.Maybe<{ __typename?: 'PullRequest', comments: { __typename?: 'IssueCommentConnection', nodes?: Types.Maybe<Array<Types.Maybe<{ __typename?: 'IssueComment', id: string, url: any, body: string, isMinimized: boolean, author?: Types.Maybe<{ __typename?: 'Bot', login: string } | { __typename?: 'EnterpriseUserAccount', login: string } | { __typename?: 'Mannequin', login: string } | { __typename?: 'Organization', login: string } | { __typename?: 'User', login: string }> }>>> } }> }> };

export type MinimizeCommentMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type MinimizeCommentMutation = { __typename?: 'Mutation', minimizeComment?: Types.Maybe<{ __typename?: 'MinimizeCommentPayload', clientMutationId?: Types.Maybe<string> }> };
