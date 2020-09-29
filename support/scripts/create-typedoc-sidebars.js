const { baseDir } = require('./helpers').default;
const { promises: fs } = require('fs');

/**
 * Create a fresh sidebar file for the docs api.
 */
function createFile() {
  return fs.writeFile(
    baseDir('support/website/sidebars.js'),
    'module.exports = { typedocSidebar: {} };',
  );
}

/**
 * Reset the sidebar file for the docs.
 */
async function main() {
  try {
    require('../website/sidebars');
    await fs.unlink(baseDir('support/website/sidebars.js'));
    await createFile();
  } catch {
    await createFile();
  }
}

main();
