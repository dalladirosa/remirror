import { camelCase, pascalCase } from 'case-anything';
import chalk from 'chalk';
import cheerio from 'cheerio';
import { promises as fs } from 'fs';
import globby from 'globby';
import path from 'path';

const remixIconNodeModules = path.resolve(__dirname, '../node_modules/remixicon/icons');

// The contents for the Adapted from
// https://github.com/react-icons/react-icons/blob/10199cca7abeb3efbc647090714daa279da45779/packages/react-icons/src/icons/index.js#L259-L274
const remixIconContents = [
  {
    files: path.join(remixIconNodeModules, './*/*-line.svg'),
  },
  {
    files: path.join(remixIconNodeModules, './*/*-fill.svg'),
  },
  {
    files: path.join(remixIconNodeModules, './Editor/*.svg'),
  },
];

const initialFileContents = `/* THIS FILE IS AUTO GENERATED */
import { GenIcon, IconType } from './icons-base';\n\n`;

const outputFilePath = path.resolve(
  __dirname,
  '../../packages/@remirror/react-components/src/icons/remix-icons.ts',
);

/**
 * Create the file and get the file handle.
 */
async function getFileHandle() {
  await fs.writeFile(outputFilePath, initialFileContents, 'utf-8');
}

async function getIconFiles(files: string) {
  return await globby(files, { absolute: true, onlyFiles: true });
}

async function convertIconData(svg: string) {
  const $svg = cheerio.load(svg, { xmlMode: true })('svg');

  // filter/convert attributes
  // 1. remove class attr
  // 2. convert to camelcase ex: fill-opacity => fillOpacity
  function attributeConverter(attribs: Record<string, string>, tagName: string) {
    return (
      attribs &&
      Object.keys(attribs)
        .filter(
          (name) =>
            ![
              'class',
              ...(tagName === 'svg'
                ? ['xmlns', 'xmlns:xlink', 'xml:space', 'width', 'height']
                : []),
            ].includes(name),
        )
        .reduce((obj, name) => {
          const newName = camelCase(name);

          switch (newName) {
            case 'fill':
              if (attribs[name] === 'none' || attribs[name] === 'currentColor') {
                obj[newName] = attribs[name];
              }

              break;
            default:
              obj[newName] = attribs[name];
              break;
          }

          return obj;
        }, {})
    );
  }

  function elementToTree(element: cheerio.Cheerio) {
    return element
      .filter((_, e) => e.tagName && !['style'].includes(e.tagName))
      .map((_, e) => ({
        tag: e.tagName,
        attr: attributeConverter(e.attribs, e.tagName),
        child: e.children?.length ? elementToTree(cheerio(e.children)) : undefined,
      }))
      .get();
  }

  const tree = elementToTree($svg);
  return tree[0]; // like: [ { tag: 'path', attr: { d: 'M436 160c6.6 ...', ... }, child: { ... } } ]
}

function generateIconRow(name: string, iconData: object, type = 'module') {
  return `export const ${name}: IconType = (props) => {
  return GenIcon(${JSON.stringify(iconData)})(props);
};\n\n`;
}

async function writeIconModule() {
  const exists = new Set(); // for remove duplicate

  for (const content of remixIconContents) {
    const files = await getIconFiles(content.files);

    for (const file of files) {
      const svgString = await fs.readFile(file, 'utf8');
      const iconData = await convertIconData(svgString);

      const rawName = path.basename(file, path.extname(file));
      const name = `${pascalCase(rawName).replace(/^4/, 'Four').replace(/^24/, 'TwentyFour')}Icon`;

      if (exists.has(name)) {
        continue;
      }

      exists.add(name);

      // write like: module/fa/index.esm.js
      const fileContent = generateIconRow(name, iconData);
      await fs.appendFile(outputFilePath, fileContent, 'utf8');

      exists.add(file);
    }
  }
}

/**
 * Run the file.
 */
async function run() {
  console.log(chalk`Generating icons for {grey \`@remirror/react-components\`}`);

  await getFileHandle();
  await writeIconModule();

  console.log(chalk`{green Icons generated} 🙌`);
}

run();
