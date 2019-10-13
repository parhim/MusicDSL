import {MusicProgram} from "./dsl/MusicProgram";

let musicProgram = new MusicProgram("valid/sample.tdot");
try{
    musicProgram.parse();
    musicProgram.compile();
} catch(err){
    console.log(err);
}