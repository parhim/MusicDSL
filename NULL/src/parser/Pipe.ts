import {Node} from "./Node";
import Tokenizer from "../parser/Tokenizer";
import {Tokens} from "./KeyWords";
import {CompileError} from "../errors/CompileError";
import Loop from "./Loop";
import VarUse from "./VarUse";
import KeyWords from "./KeyWords";

export default class Pipe extends Node {
  sequence: Array<Node|0>;

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
      } else if (+context.top() === 0) {
        context.pop();
        this.sequence.push(0);
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

  private length(node: any): number {
    let len = 0;
    // Not really necessary, since all tracks should already be the same size
    node.forEach((node) => {
      len = Math.max(len, node.Notes.length);
    });
    return len;
  }

  public compile() {
      try {
        if (KeyWords.Debug) console.log(`====Pipe Start====`);
        let seq = [];
        let out = [];

        this.sequence.forEach((node) => {
            if (node === 0) {
              seq.push([{ Instrument: Tokens.INSTRUMENTS.RHYTHMIC.KICK, Notes: [0], }]); // Just an empty track
            } else {
              let comp = node.compile();
              if (typeof(comp) === 'object'){
                seq.push(comp);
              } else {
                // console.log(typeof(comp), comp); // Handling unfinished loop
              }
            }
        });

        let prepend = 0;
        let maxlength = 0;
        seq.forEach((node) => {
          maxlength += this.length(node);
        });

        seq.forEach((node) => {
          let len = this.length(node);
          let append = maxlength - (len + prepend);
          if (KeyWords.Debug) console.log('Pipe',maxlength, len);

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

          node.forEach((track) => {
            let newTrack = JSON.parse(JSON.stringify(track));
            newTrack.Notes = preparray.concat(newTrack.Notes, apparray);
            out.push(newTrack);
          })

          prepend += len;
        });
        if (KeyWords.Debug) console.log(`====Pipe End====`);
        return out;
      } catch (err) {
          throw new CompileError(err.message);
      }
  }

  public root(): Node {
      return this;
  }

}