import { toMinimize } from '../src/run.js'

describe('filter to minimize', () => {
  test('no filter', () => {
    expect(
      toMinimize(
        {
          id: `id`,
          body: `body`,
          isMinimized: false,
          url: `https://www.example.com`,
        },
        {
          authors: [],
          endsWith: [],
          startsWith: [],
          contains: [],
          token: `token`,
        },
      ),
    ).toBeFalsy()
  })

  test('already minimized', () => {
    expect(
      toMinimize(
        {
          id: `id`,
          body: `body`,
          isMinimized: true,
          url: `https://www.example.com`,
          author: { login: 'github-actions' },
        },
        {
          authors: ['github-actions'],
          endsWith: [],
          startsWith: [],
          contains: [],
          token: `token`,
        },
      ),
    ).toBeFalsy()
  })

  test('authors filter', () => {
    expect(
      toMinimize(
        {
          id: `id`,
          body: `body`,
          isMinimized: false,
          url: `https://www.example.com`,
          author: { login: 'github-actions' },
        },
        {
          authors: ['github-actions'],
          endsWith: [],
          startsWith: [],
          contains: [],
          token: `token`,
        },
      ),
    ).toBeTruthy()
  })
  test('authors filter did not match', () => {
    expect(
      toMinimize(
        {
          id: `id`,
          body: `body`,
          isMinimized: false,
          url: `https://www.example.com`,
          author: { login: 'github-actions' },
        },
        {
          authors: ['bot'],
          endsWith: [],
          startsWith: [],
          contains: [],
          token: `token`,
        },
      ),
    ).toBeFalsy()
  })

  test('starts-with filter', () => {
    expect(
      toMinimize(
        {
          id: `id`,
          body: `<!-- head -->body`,
          isMinimized: false,
          url: `https://www.example.com`,
        },
        {
          authors: [],
          endsWith: [],
          startsWith: ['<!-- head -->'],
          contains: [],
          token: `token`,
        },
      ),
    ).toBeTruthy()
  })
  test('starts-with filter did not match', () => {
    expect(
      toMinimize(
        {
          id: `id`,
          body: `body`,
          isMinimized: false,
          url: `https://www.example.com`,
        },
        {
          authors: [],
          endsWith: [],
          startsWith: ['<!-- head -->'],
          contains: [],
          token: `token`,
        },
      ),
    ).toBeFalsy()
  })

  test('ends-with filter', () => {
    expect(
      toMinimize(
        {
          id: `id`,
          body: `body<!-- tail -->`,
          isMinimized: false,
          url: `https://www.example.com`,
        },
        {
          authors: [],
          endsWith: ['<!-- tail -->'],
          startsWith: [],
          contains: [],
          token: `token`,
        },
      ),
    ).toBeTruthy()
  })
  test('ends-with filter did not match', () => {
    expect(
      toMinimize(
        {
          id: `id`,
          body: `body`,
          isMinimized: false,
          url: `https://www.example.com`,
        },
        {
          authors: [],
          endsWith: ['<!-- tail -->'],
          startsWith: [],
          contains: [],
          token: `token`,
        },
      ),
    ).toBeFalsy()
  })

  test('contains filter', () => {
    expect(
      toMinimize(
        {
          id: `id`,
          body: `foo<!-- mark -->bar`,
          isMinimized: false,
          url: `https://www.example.com`,
        },
        {
          authors: [],
          endsWith: [],
          startsWith: [],
          contains: ['<!-- mark -->'],
          token: `token`,
        },
      ),
    ).toBeTruthy()
  })
  test('contains filter did not match', () => {
    expect(
      toMinimize(
        {
          id: `id`,
          body: `foo<!-- mark -->bar`,
          isMinimized: false,
          url: `https://www.example.com`,
        },
        {
          authors: [],
          endsWith: [],
          startsWith: [],
          contains: ['<!-- bar -->'],
          token: `token`,
        },
      ),
    ).toBeFalsy()
  })
})
