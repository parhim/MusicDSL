import { Node } from "./Node";
import Tokenizer from "../parser/Tokenizer";
import { Tokens } from "./KeyWords";
import SymbolTable from "./SymbolTable";
import { MissingDeclarationError } from "../errors/MissingDeclarationError";

export default class Return extends Node {
    name: String;

    constructor() {
        super();
    }

    public parse(context: Tokenizer) {
        this.name = context.getAndCheckNextReg(Tokens.IDENTIFIER);
    }


    public compile() {
        if (!SymbolTable.has(this.name))
            throw new MissingDeclarationError(this.name + " has not been declared");
        return SymbolTable.get(this.name);
    }


}