import {MusicProgram} from "./dsl/MusicProgram";

let musicProgram = new MusicProgram("grammarsamples/grammar.txt");
try{
    musicProgram.parse();
    musicProgram.compile();
} catch(err){
    console.log(err);
}