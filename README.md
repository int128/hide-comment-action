# hide-comment-action [![ts](https://github.com/int128/hide-comment-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/hide-comment-action/actions/workflows/ts.yaml)

This is an action to hide comment(s) in a pull request.


## Getting Started

This action will hide comment(s) which matches to the following filters:

- The body of comment starts with one of `starts-with`
- The author of comment is one of `authors`
- The comment is not hidden

To run this action:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: int128/hide-comment-action@v1
        with:
          starts-with: |
            <!-- your-workflow-job -->
```


## Inputs

| Name | Required | Description
|------|----------|-------------
| `starts-with` | yes | multi-line string of starts-with filter
| `authors` | yes | multi-line string of author filter (default to `github-actions`)
| `token` | no | GitHub token to post a comment
