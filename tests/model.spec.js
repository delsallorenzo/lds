import { test } from '@playwright/test'
import fs from 'node:fs'
import assert from 'node:assert/strict'

test('compact model preserves topology and coordinate precision', () => {
  const original = fs.readFileSync('src/assets/model.obj', 'utf8').split('\n')
  const compact = fs.readFileSync('src/assets/model.txt', 'utf8').split('\n')
  assert.equal(compact.length, original.length)
  for (let i = 0; i < original.length; i++) {
    if (!/^(v|vn|vt) /.test(original[i])) {
      assert.equal(compact[i], original[i])
      continue
    }
    const a = original[i].trim().split(/\s+/).slice(1).map(Number)
    const b = compact[i].trim().split(/\s+/).slice(1).map(Number)
    assert.equal(a.length, b.length)
    assert(a.every((coordinate, index) => Math.abs(coordinate - b[index]) <= 0.0000005 + 1e-12))
  }
})
