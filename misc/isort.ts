import * as esModuleLexer from "es-module-lexer";
import process from "node:process";
import fs from "node:fs";

// usage
//   npx tsx misc/isort.ts src/utils/tab-manager.ts

async function main() {
  const [inFile] = process.argv.slice(2);
  // const src = await fs.promises.readFile(inFile, "utf-8");
  const src = `
  import { name } from 'mod\\u1011';
  import json from './json.json' assert { type: 'json' }
  export var p = 5;
  export function q () {

  };
  export { x as 'external name' } from 'external';

  // Comments provided to demonstrate edge cases
  import /*comment!*/ (  'asdf', { assert: { type: 'json' }});
  import /*comment!*/.meta.asdf;
`;

  await esModuleLexer.init;
  const [imports, exports] = esModuleLexer.parse(src);
  console.log({ imports, exports });
}

main();
