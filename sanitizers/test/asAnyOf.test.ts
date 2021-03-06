import { expect } from 'chai'
import { asAnyOf, asArray, asBoolean, asNumber, asString, Result } from '../src'

describe('asAnyOf', () => {
  it('should work with one failing nested sanitizer', async () => {
    const mySanitizer = asAnyOf([asBoolean], 'as any of')
    const result = mySanitizer('1', 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'as any of' }])
    )
  })

  it('should work with one passing nested sanitizer', async () => {
    const mySanitizer = asAnyOf([asNumber], 'as any of')
    const result = mySanitizer('1', 'path')
    expect(result).to.deep.equal(
      Result.ok(1)
    )
  })

  it('should work if passing sanitizer is the first of multiple failing sanitizers', async () => {
    const mySanitizer = asAnyOf([asNumber, asBoolean, asBoolean, asBoolean], 'as any of')
    const result = mySanitizer('1', 'path')
    expect(result).to.deep.equal(
      Result.ok(1)
    )
  })

  it('should work if passing sanitizer is the last of multiple failing sanitizers', async () => {
    const mySanitizer = asAnyOf([asBoolean, asBoolean, asBoolean, asNumber], 'as any of')
    const result = mySanitizer('1', 'path')
    expect(result).to.deep.equal(
      Result.ok(1)
    )
  })

  it('should work if passing sanitizer is in the middle of multiple failing sanitizers', async () => {
    const mySanitizer = asAnyOf([asBoolean, asNumber, asBoolean, asBoolean], 'as any of')
    const result = mySanitizer('1', 'path')
    expect(result).to.deep.equal(
      Result.ok(1)
    )
  })

  it('should work if there are multiple, not passing sanitizers', async () => {
    const mySanitizer = asAnyOf([asBoolean, asString], 'as any of')
    const result = mySanitizer(1, 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'as any of' }])
    )
  })

  it('should work with nested errors', async () => {
    const mySanitizer = asAnyOf([asArray(asString), asArray(asNumber)], 'as any of')
    const result = mySanitizer([1, 'x'], 'path')
    expect(result).to.deep.equal(
      Result.error([{ path: 'path', expected: 'as any of' }])
    )
  })

  it('should take the first of multiple passing nested sanitizers', async () => {
    expect(asAnyOf([asNumber, asString], 'as any of')('1', 'path'))
      .to.deep.equal(Result.ok(1))

    expect(asAnyOf([asString, asNumber], 'as any of')('1', 'path'))
      .to.deep.equal(Result.ok('1'))
  })
})
