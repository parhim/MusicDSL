import IProgram from './IProgram';
import ProgramOutput from "./ProgramOutput";
import { ProgramOutputStatus } from "./ProgramOutput";
import Tokenizer from "../parser/Tokenizer";
import { Node } from "../parser/Node";
import SymbolTable from "../parser/SymbolTable";
import AstVisitor from "../ast/AstVisitor";
import * as fs from "fs";
import * as path from "path";
import KeyWords, { Punctuation, Tokens } from '../parser/KeyWords';
import {ParserError} from '../errors/ParserError';

export class MusicProgram implements IProgram {

    source: string;
    ast: Node;
    symbolTable: SymbolTable;
    name: String;

    constructor(source: string) {
        this.source = source;
    }

    public parse(): ProgramOutput {
        try {
            let context = new Tokenizer(this.source);
            let node = null;

            this.initializeSong(context);

            while (context.hasNext()) {
                let nextToken = context.top();
                if (KeyWords.isInstrument(nextToken)) {
                    // node = new Instrument(); TODO maybe use a factory to return the right type of instrument. 
                }
                else if (Tokens.SECTION == nextToken){
                    // node = new Section()
                }
                else if (Tokens.RETURN == nextToken){
                    // node = new Return()
                }
                else {
                    throw new ParserError("Unrecognizable token: ${nextToken}");
                }
            }

            node.parse(context);
            this.ast = node.root(); // hmm.. 

            this.symbolTable = new SymbolTable();

            let visitor = new AstVisitor(this.ast);
            visitor.addListener(this.symbolTable);
            visitor.traverse();

            return new ProgramOutput(ProgramOutputStatus.SUCCESS, this.ast, this.symbolTable, []);
        } catch (err) {
            return new ProgramOutput(ProgramOutputStatus.ERROR, this.ast, this.symbolTable, []);
        }


    }

    public compile(): ProgramOutput {
        try {
            let parseOutput = this.parse();
            if (parseOutput.status == ProgramOutputStatus.ERROR) {
                parseOutput.errors.forEach((e) => {
                    console.log(e.message);
                });
                return parseOutput;
            }
            let visitor = new AstVisitor(this.ast);
            this.ast.setTargetPath(this.targetPath());
            this.ast.compile();

            let output = new ProgramOutput(ProgramOutputStatus.SUCCESS, this.ast, this.symbolTable, []);

            return output;
        } catch (err) {
            return new ProgramOutput(ProgramOutputStatus.ERROR, this.ast, this.symbolTable, [err]);
        }
    }

    public targetPath(): string {
        let mypath = this.source.split("/");
        let program_name = mypath[mypath.length - 1].replace(".tdot", ".dot");
        program_name = "target_" + program_name;

        return path.join(__dirname, "../../resources/build", program_name);
    }

    public initializeSong(context: Tokenizer) {
        const iterator = this.generator("");
        while (context.hasNext()) {
            let nextToken = context.pop();
            if (iterator.next(nextToken).value == undefined) {
                throw new ParserError("Unrecognizable token: ${nextToken}");
            }
        }
    }

    public *generator(t) {
        if (t != Tokens.CREATESONG) return;
        yield;
        if (t != Punctuation.L_PAREN) return;
        yield;
        this.name = yield t;
        if (t != Punctuation.R_PAREN) return;
        yield;
        if (t != Punctuation.COLON) return;
        yield;
    }
}