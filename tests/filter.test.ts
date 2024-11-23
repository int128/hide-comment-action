import { toMinimize } from '../src/filter.js'

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
        },
      ),
    ).toBeFalsy()
  })
})
