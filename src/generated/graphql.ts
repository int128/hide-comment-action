/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import * as Types from './graphql-types.js';

export type CommentsQueryVariables = Exact<{
  owner: string;
  name: string;
  number: number;
}>;


export type CommentsQuery = { repository: { pullRequest: { comments: { nodes: Array<{ id: string, url: string, body: string, isMinimized: boolean, author:
            | { login: string }
            | { login: string }
            | { login: string }
            | { login: string }
            | { login: string }
           | null } | null> | null } } | null } | null };

export type MinimizeCommentMutationVariables = Exact<{
  id: string | number;
}>;


export type MinimizeCommentMutation = { minimizeComment: { clientMutationId: string | null } | null };
