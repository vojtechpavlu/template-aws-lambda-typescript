import * as fs from 'node:fs';
import * as path from 'node:path';
import * as esbuild from 'esbuild';

// Const searching for all files in the src/handler directory
// and creating an array of their paths
const handlersDirectory = path.join(import.meta.dirname, 'src', 'handler');
fs.readdir(handlersDirectory, (err, files) => {
  if (err) {
    console.error('Error reading handlers directory:', err);
    process.exit(1);
  }
  // Filter for .ts files (or .js if you prefer)
  const handlerFiles = files.filter((file) => file.endsWith('.ts'));

  for (const handlerFile of handlerFiles) {
    console.log(`Building file: ${handlerFile}`);

    const absoluteHandlerFile = path.join(handlersDirectory, handlerFile);
    
    esbuild.buildSync({
      entryPoints: [absoluteHandlerFile],
      bundle: true,
      platform: 'node',
      target: 'node20',
      format: 'esm',
      outfile: `dist/${absoluteHandlerFile.split('/').pop().replace('.ts', '.mjs')}`,
      minify: false,
      treeShaking: true,
      sourcemap: false,
    });
  }
});
