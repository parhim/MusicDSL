import { Node } from "./Node";
import Tokenizer from "./Tokenizer";
import { ParserError } from '../errors/ParserError';
import { Tokens, Punctuation } from "./KeyWords";
import { CompileError } from "../errors/CompileError";
import SymbolTable from "./SymbolTable";
import { MissingDeclarationError } from "../errors/MissingDeclarationError";

export default class Loop extends Node {
    private num: number;
    private name: String;
    constructor() {
        super();
        this.name = "";
    }

    public parse(context: Tokenizer) {
        context.getAndCheckNext(Tokens.LOOP);
        context.getAndCheckNext(Punctuation.L_PAREN);
        this.name = context.getAndCheckNextReg(Tokens.IDENTIFIER);
        context.getAndCheckNext(Punctuation.COMMA);
        this.num = Number(context.getAndCheckNextReg(Tokens.NUMBER));
        if(isNaN(this.num)) throw new ParserError(`Expected a number. Got: ${this.num}`)
        context.getAndCheckNext(Punctuation.R_PAREN);
    }

    private nameCheck() {
        if(!SymbolTable.has(name)) throw new MissingDeclarationError("This section/primitive has not been declared: " + name);
    }

    public compile(): any {
        try {
            // get the section or primitive. 
            SymbolTable.get(this.name);

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