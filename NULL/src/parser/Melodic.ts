import {Node} from "./Node";
import Tokenizer from "../parser/Tokenizer";
import {ParserError} from '../errors/ParserError';
import {CompileError} from "../errors/CompileError";
import {OutputWriter} from "../dsl/OutputWriter";
import Notes from "./Notes";


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
        context.pop(); // '='
        let notes = new Notes(this.name, this.instrument);
        this.notes = notes;
        notes.parse(context);
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
            return this.notes.compile();
        } catch (err) {
            throw new CompileError(err.message);
        }
    }

}