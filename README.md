# hide-comment-action [![ts](https://github.com/int128/hide-comment-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/hide-comment-action/actions/workflows/ts.yaml)

This is an action to hide comment(s) in a pull request.


## Getting Started

To run this action:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: int128/hide-comment-action@v1
        with:
          ends-with: |
            <!-- your-workflow-job -->
```

This action hides comment(s) which matches to the following filters:

- The body of comment starts with one of `starts-with`
- The body of comment ends with one of `ends-with`
- The author of comment is one of `authors`
- The comment is not hidden

It hides all comments created by `github-actions` by default.


## Inputs

| Name | Required | Description
|------|----------|-------------
| `starts-with` | no | multi-line string of starts-with filter
| `ends-with` | no | multi-line string of ends-with filter
| `authors` | no | multi-line string of author filter (default to `github-actions`)
| `token` | no | GitHub token to post a comment
