import {Node} from "./Node";
import Tokenizer from "../parser/Tokenizer";
import {CompileError} from "../errors/CompileError";
import {ParserError} from "../errors/ParserError";
import Beats from "./Beats";
import {Punctuation} from "./KeyWords";


export default class Rhythmic extends Node {
    instrument: String;
    name: String;
    beats: Beats;

    constructor() {
        super();
    }
    parse(context: Tokenizer) {
        this.instrument = context.pop();
        this.name = context.pop();
        let comma = context.pop();
        if (comma != Punctuation.EQUAL) {
            throw new ParserError(`Line ${context.getLine()} Missing '=' from ${this.instrument} declaration`);        }

        let beats = new Beats(this.name, this.instrument);
        this.beats = beats;
        beats.parse(context);
    }

    compile() {
        try {
            this.beats.compile();
        } catch (err) {
            throw new CompileError(err.message);
        }
    }

}