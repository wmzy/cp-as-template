#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const _ = require('lodash/fp');
const program = require('commander');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .usage('[options] <source> <dest>')
  .option('-v, --verbose', 'explain what is being done')
  .parse(process.argv);

const log = program.verbose ? console.log : _.noop;

const [source, dest] = program.args;

const sourceKeywords = getKeywordsFromPath(source);
const destKeywords = getKeywordsFromPath(dest);
const ext = path.extname(source);

while(sourceKeywords.length && _.last(sourceKeywords) === _.last(destKeywords)) {
  sourceKeywords.pop();
  destKeywords.pop();
}

const sourceReg = new RegExp(sourceKeywords.join('[-_]?'), 'igm');

const upperCamelCase = words => words.map(_.capitalize).join('');
const upperCase = words => words.join('_').toUpperCase();

fs.readFile(source, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const sourceCode = data.replace(sourceReg, match => {
    const result = replace(match);
    log(`replace: [${match}] -> [${result}]`);
    return result;
  })

  fs.writeFile(dest, sourceCode, err => {
    if (err) console.error(err);
  })
});

function replace(match) {
  if (sourceKeywords.length === 1) {
    if (match === sourceKeywords[0].toUpperCase()) return upperCase(destKeywords);
    if (match === _.capitalize(sourceKeywords[0])) return upperCamelCase(destKeywords);
    if (match === sourceKeywords[0].toLowerCase()) {
      if (['.py', '.ex', '.exs'].includes(ext)) return destKeywords.join('_');
      if (['.html'].includes(ext)) return destKeywords.join('-');

      return _.camelCase(destKeywords.join(' '));
    }
  }

  if (match === upperCamelCase(sourceKeywords)) return upperCamelCase(destKeywords);
  if (match === upperCase(sourceKeywords)) return upperCase(destKeywords);
  if (match === _.camelCase(sourceKeywords.join(' '))) return _.camelCase(destKeywords.join(' '));
  if (match === _.snakeCase(sourceKeywords.join(' '))) return _.snakeCase(destKeywords.join(' '));
  if (match === _.kebabCase(sourceKeywords.join(' '))) return _.kebabCase(destKeywords.join(' '));
  return '_PLACEHOLDER_'
}

function getKeywordsFromPath(p) {
  return _.words(path.basename(p))
}
