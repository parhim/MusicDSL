import {Node} from "./Node";
import Tokenizer from "../parser/Tokenizer";
import {CompileError} from "../errors/CompileError";
import {OutputWriter} from "../dsl/OutputWriter";
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
            throw new ParserError("Missing '=' from " + this.instrument + " declaration")
        }

        let beats = new Beats(this.name, this.instrument);
        this.beats = beats;
        beats.parse(context);
    }

    compile() {
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
            return this.beats.compile();
        } catch (err) {
            throw new CompileError(err.message);
        }
    }

}