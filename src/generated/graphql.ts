import * as Types from './graphql-types';

export type CommentsQueryVariables = Types.Exact<{
  owner: Types.Scalars['String'];
  name: Types.Scalars['String'];
  number: Types.Scalars['Int'];
}>;


export type CommentsQuery = (
  { __typename?: 'Query' }
  & { repository?: Types.Maybe<(
    { __typename?: 'Repository' }
    & { pullRequest?: Types.Maybe<(
      { __typename?: 'PullRequest' }
      & { comments: (
        { __typename?: 'IssueCommentConnection' }
        & { nodes?: Types.Maybe<Array<Types.Maybe<(
          { __typename?: 'IssueComment' }
          & Pick<Types.IssueComment, 'id' | 'url' | 'body' | 'isMinimized'>
          & { author?: Types.Maybe<(
            { __typename?: 'Bot' }
            & Pick<Types.Bot, 'login'>
          ) | (
            { __typename?: 'EnterpriseUserAccount' }
            & Pick<Types.EnterpriseUserAccount, 'login'>
          ) | (
            { __typename?: 'Mannequin' }
            & Pick<Types.Mannequin, 'login'>
          ) | (
            { __typename?: 'Organization' }
            & Pick<Types.Organization, 'login'>
          ) | (
            { __typename?: 'User' }
            & Pick<Types.User, 'login'>
          )> }
        )>>> }
      ) }
    )> }
  )> }
);

export type MinimizeCommentMutationVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type MinimizeCommentMutation = (
  { __typename?: 'Mutation' }
  & { minimizeComment?: Types.Maybe<(
    { __typename?: 'MinimizeCommentPayload' }
    & Pick<Types.MinimizeCommentPayload, 'clientMutationId'>
  )> }
);
