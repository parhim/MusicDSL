import {Node} from "./Node";
import Tokenizer from "../parser/Tokenizer";
import {Tokens} from "./KeyWords";
import {CompileError} from "../errors/CompileError";
import SymbolTable from "./SymbolTable";
import { OutputWriter } from "../dsl/OutputWriter";

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
        // TODO remove, temp for testing
        if (this.name === 'final') {
          let writer = OutputWriter.getInstance("out.json", 'utf-8');
          writer.write(JSON.stringify(SymbolTable.get(this.name)));
          writer.flush();
        }
        return SymbolTable.get(this.name);
      } catch (err) {
          throw new CompileError(err.message);
      }
  }

  public root(): Node {
      return this;
  }

}