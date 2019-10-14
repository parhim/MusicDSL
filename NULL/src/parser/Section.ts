import {Node} from "./Node";
import Tokenizer from "../parser/Tokenizer";
import {ParserError} from '../errors/ParserError';
import KeyWords, {Tokens, Punctuation} from "./KeyWords";
import {CompileError} from "../errors/CompileError";
import {OutputWriter} from "../dsl/OutputWriter";
import Pipe from "./Pipe";
import SymbolTable from "./SymbolTable";

export default class Section extends Node {

    private name: String;

    constructor() {
        super();
        this.name = "";
    }

    public parse(context: Tokenizer) {
        let nodes: Array<Node> = [];
        let cont = true;

        this.name = context.pop();
        context.getAndCheckNext(Punctuation.COLON);

        let nextToken = context.pop();

        // do while cont style here
        while (cont) {
            let pipeNode = new Pipe;
            pipeNode.parse(context);
            nodes.push(pipeNode);

            nextToken = context.top();
            if (nextToken != Tokens.PIPE) {
                cont = false;
            } else {
                context.pop();
            }
        }

        this.children = nodes;
    }

    private length(pipe: any): number {
        let len = 0;
        // Not really necessary, since all tracks should already be the same size
        pipe.forEach((track) => {
          len = Math.max(len, track.Notes.length);
        });
        return len;
      }

    public compile() {
        try {
            if (KeyWords.Debug) console.log(`====SECTION ${this.name} Start====`);

            let section: Array<any> = [];
            let out: Array<any> = [];

            this.children.forEach(c => {
                section.push(c.compile());
            })

            let maxlength = 0;
            section.forEach((pipe) => {
                let slen = this.length(pipe);
                if (slen > maxlength) {
                    maxlength = slen;
                }
            })

            section.forEach((pipe) => {
                pipe.forEach((track) => {
                    if (KeyWords.Debug) console.log('Sect', track.Notes.length, maxlength);
                    let newTrack = JSON.parse(JSON.stringify(track));
                    if (track.Notes.length < maxlength) {
                        newTrack.Notes = this.appendSpace(newTrack.Notes, maxlength - newTrack.Notes.length)
                    }
                    out.push(newTrack);
                });
            })

            SymbolTable.set(this.name, out)

            if (KeyWords.Debug) console.log(`====SECTION ${this.name} END====`);
                            
        } catch (err) {
            throw new CompileError(err.message);
        }
    }

    private appendSpace(sec: Array<any>, diff: number): Array<any> {
        for (let i = 0; i < diff; i++) {
            sec.push(0);
        }

        return sec;
    } 

    public root(): Node {
        return this;
    }

}