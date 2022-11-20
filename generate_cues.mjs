#!/usr/bin/env node

import * as fs from 'fs';

const showName = 'HS2022';
const inputSceneFile = 'orig/HopeStat.022.scn';

const sceneData = fs.readFileSync(inputSceneFile).toString();
const sceneLines = sceneData.split('\n');

const numChannels = 16;

const characterChannels = Object.fromEntries(sceneLines
  .flatMap((line) => {
    let m = /^\/ch\/(\d{2})\/config "(.*)"/.exec(line);
    if(!m) {
      return;
    }

    let channel = +m[1];
    let name = m[2];

    return name.split('/').map((n) => [n.trim().toLowerCase(), channel]);
  })
  .filter((x) => x && x[1] <= numChannels));
console.dir(characterChannels);

const showHeader = [
  `#4.0#`,
  `show "${showName}" 0 0 0 0 0 0 0 0 0 0 "3.07"`,
];

const cueList = [];
const snippetList = [];

const cueChannelBitmap = (1 << numChannels) - 1;

function createSnippet(name, characters, channelBitmap = cueChannelBitmap) {
  const index = snippetList.length;
  const fullIndex = index.toString().padStart(3, '0');
  const contents = [
    `#4.0# "${name}" 128 ${cueChannelBitmap} 0 0 1`.padEnd(127, ' '),
  ];

  const enabled = new Set();

  for(let name of characters) {
    let lowerName = name.toLowerCase();
    let channel = characterChannels[lowerName];
    if(channel === undefined) {
      throw new Error(`Unknown character ${name}`)
    }

    enabled.add(channel);
  }

  for(let channel = 1; channel <= numChannels; ++channel) {
    const chName = channel.toString().padStart(2, '0');
    const status = enabled.has(channel) ? 'ON' : 'OFF';
    const line = `/ch/${chName}/mix/on ${status}`;
    contents.push(line);
  }

  const snippetFile = contents.join('\n');
  snippetList.push(`snippet/${fullIndex} "${name}" 128 ${channelBitmap} 0 0 1`);
  fs.writeFileSync(`${showName}.${fullIndex}.snp`, snippetFile + '\n');

  return { index, fullIndex };
}

const muteAllSnippet = createSnippet('Mute All Actors', []);

const cueListFile = 'cues.txt';
function processCueLine(line, i) {
  line = line.trim();
  if(!line || line.startsWith('#')) {
    return;
  }

  if(!line.includes(':')) {
    throw new Error(`Invalid line ${i + 1}: ${line}`);
  }

  console.error(line);
  let [name, rest] = line.split(':');
  let characters = (rest || '').split(',').map((c) => c.trim()).filter(Boolean);

  const cueIndex = cueList.length;
  const fullCueIndex = cueIndex.toString().padStart(3, '0');

  const snippet = characters.length ? createSnippet(name, characters) : muteAllSnippet;

  cueList.push(`cue/${fullCueIndex} ${cueIndex + 1}00 "${name}" 0 -1 ${snippet.index} 0 1 0 0`);
}

fs.readFileSync(cueListFile).toString()
  .split('\n')
  .forEach(processCueLine);

const show = [
  ...showHeader,
  ...cueList,
  `scene/000 "HopeStat2022" "" %000000000 1`,
  ...snippetList,
].join('\n');

fs.writeFileSync(`${showName}.000.scn`, sceneData + '\n');
fs.writeFileSync(`${showName}.shw`, show + '\n');



