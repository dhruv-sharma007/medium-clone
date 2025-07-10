import { readFileSync, writeFileSync } from 'node:fs';
import { glob } from 'glob';

async function fixImports() {
  const files = await glob('dist/**/*.js');
  
  for (const file of files) {
    let content = readFileSync(file, 'utf8');
    content = content.replace(
      /from\s+(['"])(\.{1,2}\/[\w-./]+)(?<!\.js)\1/g,
      'from $1$2.js$1'
    );
    writeFileSync(file, content);
  }
}

fixImports().catch(console.error);

