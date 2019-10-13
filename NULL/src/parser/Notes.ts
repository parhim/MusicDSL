import {Node} from "./Node";
import Tokenizer from "../parser/Tokenizer";
import {ParserError} from '../errors/ParserError';
import {CompileError} from "../errors/CompileError";
import {OutputWriter} from "../dsl/OutputWriter";
import KeyWords, {MeasureLength, Punctuation} from "./KeyWords";
import SymbolTable from "./SymbolTable"

export default class Notes extends Node {
    melodicInstrument: String;
    name: String;

    constructor(name: String, melodicInstrument: String) {
        super();
        this.melodicInstrument = melodicInstrument;
        this.name = name;
    }

    public parse(context: Tokenizer) {
        let notes = [];
        let lineNum = context.getLine();

        while (context.hasNext() && (lineNum == context.getLine())) {
            // TODO: figure out how to separate chords into notes and into diff tracks??

            let comma = context.pop();
            if (comma != Punctuation.COMMA) {
                throw new ParserError("Notes must be separated with commas")
            }
        }
        if (notes.length != MeasureLength)
        {
            throw new ParserError("Notes must be of length 8")
        }
        SymbolTable.set(this.name,
            {
                "Instrument" : this.melodicInstrument,
                "Notes" : notes
            });
    }

    public compile() {
        try {
            let file = this.target;
            let writer = OutputWriter.getInstance(file, 'utf-8');

            // ===== a compilation example from starter ======
            // writer.write("digraph G {\n");
            // this.children.forEach((node) => {
            //     node.compile()
            // });
            // writer.write("}");

            writer.flush();
            return SymbolTable.get(this.name);
        } catch (err) {
            throw new CompileError(err.message);
        }
    }
}