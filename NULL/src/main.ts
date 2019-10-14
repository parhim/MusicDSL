#!/usr/bin/env node

import {MusicProgram} from "./dsl/MusicProgram";
const execSync = require('child_process').execSync;
var argv = require('minimist')(process.argv.slice(2));


const inputDest = argv._[0];

const outputDest = process.cwd();
// "grammarsamples/grammar.txt"
let musicProgram = new MusicProgram(inputDest, outputDest);
try{
    musicProgram.parse();
    musicProgram.compile();
} catch(err){
    console.log("error: " + err);
}

// TODO call sam's script!!!!!
execSync('ls', { encoding: 'utf-8' });
console.log("Done!");