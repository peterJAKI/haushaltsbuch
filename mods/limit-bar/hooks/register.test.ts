import { expect, test } from 'bun:test'

test('farben', () => {
  const c = (p: number) => (p >= 90 ? 'red' : p >= 70 ? 'yellow' : p < 10 ? 'green' : 'plain')
  expect([c(5), c(69), c(70), c(89), c(90)]).toEqual(['green', 'plain', 'yellow', 'yellow', 'red'])
})
