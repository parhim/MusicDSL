import { Node } from "./Node";
import Tokenizer from "./Tokenizer";
import { ParserError } from '../errors/ParserError';
import { Tokens, Punctuation } from "./KeyWords";
import { CompileError } from "../errors/CompileError";
import { OutputWriter } from "../dsl/OutputWriter";
import SymbolTable from "./SymbolTable";

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


    public compile(): any {
        try {
            // get the section or primitive. 
            SymbolTable.get(name);

            for(let x = 0; x < this.num; x++){
                // expand it num times ?? 

            }
        } catch (err) {
            throw new CompileError(err.message);
        }
    }

    public root(): Node {
        return this;
    }

}