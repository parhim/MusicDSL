import {Node} from "./Node";
import Tokenizer from "../parser/Tokenizer";
import {Tokens} from "./KeyWords";
import {CompileError} from "../errors/CompileError";
import Loop from "./Loop";
import VarUse from "./VarUse";

export default class Pipe extends Node {
  sequence: Array<Node>;

  constructor() {
      super();
      this.sequence = [];
  }

  public parse(context: Tokenizer) {
    // Assuming pipe symbol is popped
    let cont = true;
    while (context.hasNext() && cont) {
      if (context.top() === Tokens.LOOP) {
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
      } else {
        context.pop();
      }
    }
  }


  public compile() {
      try {
        let seq = [];
        this.sequence.forEach((node) => {
            seq.push(node.compile());
        });

        let prepend = 0;
        let maxlength = 0;
        seq.forEach((node) => {
          maxlength += node.length;
        });

        seq.forEach((node) => {
          let len = node.length;
          let append = maxlength - (len + prepend);

          // Prepend
          let preparray = [];
          for (let i = 0; i < prepend; i++) {
            preparray.push(0);
          }

          // Append
          let apparray = [];
          for (let i = 0; i < append; i++) {
            apparray.push(0);
          }

          node.Notes = preparray.concat(node.Notes, apparray);

          prepend += len;
        });

        return seq;
      } catch (err) {
          throw new CompileError(err.message);
      }
  }

  public root(): Node {
      return this;
  }

}