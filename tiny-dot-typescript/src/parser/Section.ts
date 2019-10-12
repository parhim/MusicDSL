import {Node} from "./Node";
import Tokenizer from "../parser/Tokenizer";
import {ParserError} from '../errors/ParserError';
import Tokens from "./KeyWords";
import {CompileError} from "../errors/CompileError";
import {OutputWriter} from "../dsl/OutputWriter";

export default class Section extends Node {

    constructor() {
        super();
    }

    public parse(context: Tokenizer) {
        let nodes: Array<Node> = [];

        while (context.hasNext()) {
            let nextToken = context.top();
            switch (nextToken) {
                case Tokens.PIPE:
                    // TODO
                    break;
                default:
                    throw new ParserError("Unrecognizable token: ${nextToken}");
            }
        }
    }


    public compile() {
        try {
            let file = this.target;
            let writer = OutputWriter.getInstance(file, 'utf-8');

            // ===== a compilation example from starter ====== 
            // writer.write("digraph G {\n");
            // this.children.forEach((node) => {
            //     node.compile()
            // });
            // writer.write("}");

            writer.flush();
        } catch (err) {
            throw new CompileError(err.message);
        }
    }

    public root(): Node {
        return this;
    }

}