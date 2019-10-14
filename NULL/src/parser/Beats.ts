import {Node} from "./Node";
import Tokenizer from "../parser/Tokenizer";
import {ParserError} from '../errors/ParserError';
import {CompileError} from "../errors/CompileError";
import {MeasureLength, Notes, Punctuation} from "./KeyWords";
import SymbolTable from "./SymbolTable"

export default class Beats extends Node {
    rhythmInstrument: String;
    name: String;
    beats: Array<Number>;

    constructor(name: String, rhythmInstrument: String) {
        super();
        this.rhythmInstrument = rhythmInstrument;
        this.name = name;
    }

    public parse(context: Tokenizer) {
        let lineNum = context.getLine();

        while (context.hasNext() && (lineNum == context.getLine())) {
            let beat = Number(context.pop());

            if (beat == Notes.RHYTHMIC.ZERO) {
                this.beats.push(Notes.RHYTHMIC.ZERO)
            } else if (beat == Notes.RHYTHMIC.ONE) {
                this.beats.push(Notes.RHYTHMIC.ONE)
            }

            let comma = context.pop();
            if (comma != Punctuation.COMMA) {
                throw new ParserError("Beats must be separated with commas")
            }
        }

        if (this.beats.length != MeasureLength)
        {
            throw new ParserError("Beats must be of length 8")
        }
    }

    public compile() {
        try {
            SymbolTable.set(this.name,
                [
                    {
                        "Instrument" : this.rhythmInstrument,
                        "Notes" : this.beats
                    }
                ]);
        } catch (err) {
            throw new CompileError(err.message);
        }
    }
}