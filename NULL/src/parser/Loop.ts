import { Node } from "./Node";
import Tokenizer from "./Tokenizer";
import { ParserError } from '../errors/ParserError';
import { Tokens, Punctuation } from "./KeyWords";
import { CompileError } from "../errors/CompileError";
import { OutputWriter } from "../dsl/OutputWriter";

export default class Loop extends Node {
    private num: number;
    private name: string;
    constructor() {
        super();
    }

    public parse(context: Tokenizer) {
        context.getAndCheckNext(Tokens.LOOP);
        context.getAndCheckNext(Punctuation.L_PAREN);
        this.name = context.top();
        context.getAndCheckNext(Punctuation.COMMA);
        context.getAndCheckNext(Tokens.IDENTIFIER);
        this.num = Number(context.top());
        if(isNaN(this.num)) throw new ParserError("Expected a number. Got: ${this.num}")
        context.getAndCheckNext(Punctuation.R_PAREN);
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

    private *generate(t: String) {

    }

    public root(): Node {
        return this;
    }

}