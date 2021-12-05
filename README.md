# hide-comment-action [![ts](https://github.com/int128/hide-comment-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/hide-comment-action/actions/workflows/ts.yaml)

This is an action to hide (minimize) comments in a pull request.

![screenshot](https://user-images.githubusercontent.com/321266/128599297-0edb5a92-7c83-42c7-9f8a-8946b4049ed3.png)


## Getting Started

To run this action:

```yaml
jobs:
  hide:
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

It hides all comment(s) created by `github-actions` by default.

It hides comment(s) only if triggered on a pull request event.


## Inputs

| Name | Default | Description
|------|----------|-------------
| `starts-with` | - | multi-line string of starts-with filter
| `ends-with` | - | multi-line string of ends-with filter
| `authors` | `github-actions` | multi-line string of author filter
| `token` | `${{ github.token }}` | GitHub token to post a comment
