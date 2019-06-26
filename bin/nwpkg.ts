#!/usr/bin/env node

import commander from 'commander';
import { prompt, Questions } from 'inquirer';

import { Builder } from './../src/builder';

const questions: Questions = [
  {
    type: 'input',
    name: 'platform',
    message: 'Platform to build'
  }
]

commander
  .version('1.0.0')
  .description('NWjs Packager')

commander
  .command('build')
  .alias('b')
  .description('Build your apps for Mac, Win and Linux')
  .action(() => {
    prompt(questions).then((answers) => new Builder().build(answers.platform))
  })

commander.parse(process.argv);

