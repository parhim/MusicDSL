import {Node} from "./Node";
import Tokenizer from "../parser/Tokenizer";
import {ParserError} from '../errors/ParserError';
import {Tokens} from "./KeyWords";
import {CompileError} from "../errors/CompileError";
import {OutputWriter} from "../dsl/OutputWriter";
import Loop from "./Loop";
import VarUse from "./VarUse";

export default class Pipe extends Node {
  sequence: Array<Node>; // TODO

  constructor() {
      super();
      this.sequence = [];
  }

  public parse(context: Tokenizer) {
    // Assuming pipe symbol is popped
    let cont = true;
    while (cont) {
      if (context.checkNext(Tokens.LOOP)) {
        let loop = new Loop();
        loop.parse(context);
        this.sequence.push(loop);
      } else {
        let varuse = new VarUse();
        varuse.parse(context);
        this.sequence.push(varuse);
      }

      // Determine end of a pipe by the lack of a comma
      if (context.top() !== Tokens.PUNCTUATION.COMMA) {
        cont = false;
      }
    }
  }


  public compile() {
      try {
        let seq = [];
          this.sequence.forEach((node) => {
              seq.push(node.compile()); // TODO ensure melodic/rhythmic return array of tracks
          });
          // TODO append/prepend zeros
      } catch (err) {
          throw new CompileError(err.message);
      }
  }

  public root(): Node {
      return this;
  }

}