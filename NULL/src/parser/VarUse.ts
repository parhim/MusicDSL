import {Node} from "./Node";
import Tokenizer from "../parser/Tokenizer";
import {Tokens} from "./KeyWords";
import {CompileError} from "../errors/CompileError";
import SymbolTable from "./SymbolTable";

export default class VarUse extends Node {
  name: String; // TODO

  constructor() {
      super();
      this.name = "";
  }

  public parse(context: Tokenizer) {
    this.name = context.getAndCheckNextReg(Tokens.IDENTIFIER);
  }


  public compile() {
      try {
        return SymbolTable.get(this.name);
      } catch (err) {
          throw new CompileError(err.message);
      }
  }

  public root(): Node {
      return this;
  }

}