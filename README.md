# hide-comment-action [![ts](https://github.com/int128/hide-comment-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/hide-comment-action/actions/workflows/ts.yaml)

This is an action to hide (minimize) comments in a pull request.

![screenshot](https://user-images.githubusercontent.com/321266/128599297-0edb5a92-7c83-42c7-9f8a-8946b4049ed3.png)


## Getting Started

To hide comments when a pull request is created or updated:

```yaml
on:
  pull_request:

jobs:
  hide-comment:
    steps:
      - uses: int128/hide-comment-action@v1
```

It hides all comments created by `github-actions` user.

### Filter comments

You can set the following conditions:

- The author of comment is one of `authors`
- The body of comment starts with one of `starts-with`
- The body of comment ends with one of `ends-with`
- The body of comment contains one of `contains`

This action hides comment(s) which matches to **any** condition, i.e., evaluated as OR.

If no condition is given, this action hides comment(s) created by the user of GitHub token.


### Example: using `ends-with` condition

When you post a comment, it would be nice to add some marker so that you can hide it in the next build.

Here is an example workflow to hide the old comments before test.

```yaml
jobs:
  test:
    steps:
      - uses: int128/hide-comment-action@v1
        with:
          ends-with: |
            <!-- test-notification -->
      - uses: int128/comment-action@v1
        with:
          run: yarn test
          post-on-failure: |
            ## :x: Test failure
            ```
            ${run.output}
            ```
            <!-- test-notification -->
```


## Specification

This action works on pull request event only.
It ignores other events.

### Inputs

| Name | Default | Description
|------|----------|-------------
| `authors` | - | Multi-line string of author condition
| `starts-with` | - | Multi-line string of starts-with condition
| `ends-with` | - | Multi-line string of ends-with condition
| `contains` | - | Multi-line string of contains condition
| `issue-number` | - | Number of an issue or pull request on which to hide comment(s)
| `token` | `${{ github.token }}` | GitHub token to post a comment
