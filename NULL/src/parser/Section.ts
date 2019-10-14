import {Node} from "./Node";
import Tokenizer from "../parser/Tokenizer";
import {ParserError} from '../errors/ParserError';
import {Tokens, Punctuation} from "./KeyWords";
import {CompileError} from "../errors/CompileError";
import {OutputWriter} from "../dsl/OutputWriter";
import Pipe from "./Pipe";
import SymbolTable from "./SymbolTable";

export default class Section extends Node {

    private name: String;

    constructor() {
        super();
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

            nextToken = context.pop();
            if (nextToken != Tokens.PIPE) {
                cont = false;
            }
        }

        while (nextToken == Tokens.PIPE) {
            let pipeNode = new Pipe;
            pipeNode.parse(context);
            nodes.push(pipeNode);

            nextToken = context.pop();
        }

        this.children = nodes;
    }


    public compile() {
        try {

            let section: Array<any> = [];

            this.children.forEach(c => {
                section.push(c.compile());
            })

            let maxlength = 0;
            section.forEach(s => {
                if (s.Notes.length > maxlength) {
                    maxlength = s.Notes.length;
                }
            })

            section.forEach(s => {
                if (s.Notes.length < maxlength) {
                    s.Notes = this.appendSpace(s.Notes, s.Notes.length - maxlength)
                }
            })

            SymbolTable.set(this.name, section)
                            
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