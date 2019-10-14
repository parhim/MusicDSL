import {Node} from "./Node";
import Tokenizer from "../parser/Tokenizer";
import {ParserError} from '../errors/ParserError';
import {CompileError} from "../errors/CompileError";
import {OutputWriter} from "../dsl/OutputWriter";
import Notes from "./Notes";
import {Punctuation} from "./KeyWords";


export default class Melodic extends Node {
    instrument: String;
    name: String;
    notes: Notes;

    constructor() {
        super();
    }
    parse(context: Tokenizer) {
        this.instrument = context.pop();
        this.name = context.pop();
        let comma = context.pop();
        if (comma != Punctuation.EQUAL) {
            throw new ParserError("Missing '=' from " + this.instrument + " declaration")
        }

        let notes = new Notes(this.name, this.instrument);
        this.notes = notes;
        notes.parse(context);
    }

    compile() {
        try {
            this.notes.compile();
        } catch (err) {
            throw new CompileError(err.message);
        }
    }

}