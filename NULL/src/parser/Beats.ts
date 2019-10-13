import {Node} from "./Node";
import Tokenizer from "../parser/Tokenizer";
import {ParserError} from '../errors/ParserError';
import {CompileError} from "../errors/CompileError";
import {OutputWriter} from "../dsl/OutputWriter";
import KeyWords from "./KeyWords";

export default class Beats extends Node {


    constructor() {
        super();
    }

    public parse(context: Tokenizer) {
        let beats = [];
        let lineNum = context.getLine();

        context.

        while (context.hasNext() && lineNum == context.getLine()) {
            let beat = Number.valueOf(context.pop());

            if (beat == KeyWords.notes.RHYTHMIC.ZERO) {
                beats.push(KeyWords.notes.RHYTHMIC.ZERO)
            } else if (beat == KeyWords.notes.RHYTHMIC.ONE) {
                beats.push(KeyWords.notes.RHYTHMIC.ONE)
            }
            context.pop()
        }
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
        } catch (err) {
            throw new CompileError(err.message);
        }
    }

    public root(): Node {
        return this;
    }
}