import {Node} from "./Node";
import Tokenizer from "../parser/Tokenizer";
import {ParserError} from '../errors/ParserError';
import {CompileError} from "../errors/CompileError";
import {OutputWriter} from "../dsl/OutputWriter";
import {MeasureLength, Notes, Punctuation} from "./KeyWords";
import SymbolTable from "./SymbolTable"

export default class Beats extends Node {
    rhythmInstrument: String;
    name: String;

    constructor(name: String, rhythmInstrument: String) {
        super();
        this.rhythmInstrument = rhythmInstrument;
        this.name = name;
    }

    public parse(context: Tokenizer) {
        let beats = [];
        let lineNum = context.getLine();

        while (context.hasNext() && (lineNum == context.getLine())) {
            let beat = Number(context.pop());

            if (beat == Notes.RHYTHMIC.ZERO) {
                beats.push(Notes.RHYTHMIC.ZERO)
            } else if (beat == Notes.RHYTHMIC.ONE) {
                beats.push(Notes.RHYTHMIC.ONE)
            }

            let comma = context.pop();
            if (comma != Punctuation.COMMA) {
                throw new ParserError("Beats must be separated with commas")
            }
        }

        if (beats.length != MeasureLength)
        {
            throw new ParserError("Beats must be of length 8")
        }

        let beatsArray = [beats];
        SymbolTable.set(this.name,
            [
                {
                    "Instrument" : this.rhythmInstrument,
                    "Notes" : beatsArray
                }
            ]);
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