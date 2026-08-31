import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export function transform(input) {
  if (!Array.isArray(input.values) || !input.values.every((value) => typeof value === 'string')) {
    throw new Error('values must be an array of strings')
  }
  return {
    values: [...new Set(input.values)]
      .sort((left, right) => left.localeCompare(right))
      .map((value) => value.toUpperCase()),
  }
}

export const INPUT_PATH = '/hub/input/input.json'
export const OUTPUT_PATH = '/hub/output/result.json'
export const INPUT_SCHEMA_ID = 'cli-job-input-json/v1'
export const RESULT_SCHEMA_ID = 'cli-job-result-descriptor/v1'

export function execute(inputDocument) {
  if (!inputDocument || inputDocument.schemaId !== INPUT_SCHEMA_ID || !inputDocument.input) {
    throw new Error('input document does not satisfy cli-job-input-json/v1')
  }
  return { schemaId: RESULT_SCHEMA_ID, result: transform(inputDocument.input) }
}

export function run(inputPath = INPUT_PATH, outputPath = OUTPUT_PATH) {
  const result = execute(JSON.parse(readFileSync(inputPath, 'utf8')))
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, JSON.stringify(result), 'utf8')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) run()
