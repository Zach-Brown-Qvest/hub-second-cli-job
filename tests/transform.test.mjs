import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { INPUT_SCHEMA_ID, RESULT_SCHEMA_ID, run } from '../src/transform.mjs'

test('transform uses only the fixed JSON input and output paths', () => {
  const directory = mkdtempSync(join(tmpdir(), 'hub-cli-protocol-'))
  const inputPath = join(directory, 'input.json')
  const outputPath = join(directory, 'output.json')
  writeFileSync(inputPath, JSON.stringify({
    schemaId: INPUT_SCHEMA_ID,
    input: { values: ['zebra', 'apple', 'apple'] },
  }))
  run(inputPath, outputPath)
  assert.deepEqual(JSON.parse(readFileSync(outputPath, 'utf8')), {
    schemaId: RESULT_SCHEMA_ID,
    result: { values: ['APPLE', 'ZEBRA'] },
  })
})
