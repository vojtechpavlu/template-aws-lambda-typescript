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

    // Construct the absolute path to the handler file being currently compiled
    const absoluteHandlerFile = path.join(handlersDirectory, handlerFile);

    // Construct the destination path for the compiled file
    // It will be placed in the `./dist` directory with a `.cjs` extension
    const destinationPath = path.join(
      import.meta.dirname,
      'dist',
      handlerFile.replace(/\.ts$/, '.cjs')
    );

    esbuild.buildSync({
      entryPoints: [absoluteHandlerFile],
      bundle: true,
      platform: 'node',
      target: 'node20',
      format: 'cjs',
      outfile: destinationPath,
      minify: true,
      treeShaking: true,
      sourcemap: false,
      external: [
        // Exclude these packages from the bundle since
        // they already exist in the AWS Lambda environment
        '@aws-sdk/client-dynamodb',
        '@aws-sdk/lib-dynamodb',
      ],
    });
  }
});
