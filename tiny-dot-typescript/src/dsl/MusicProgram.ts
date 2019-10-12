import IProgram from './IProgram';
import ProgramOutput from "./ProgramOutput";
import {ProgramOutputStatus} from "./ProgramOutput";
import Tokenizer from "../parser/Tokenizer";
import {Node} from "../parser/Node";
import SymbolTable from "../parser/SymbolTable";
import AstVisitor from "../ast/AstVisitor";
import * as fs from "fs";
import * as path from "path";

export class MusicProgram implements IProgram {

    source: string;
    ast: Node;
    symbolTable: SymbolTable;

    constructor(source: string) {
        this.source = source;
    }

    public parse(): ProgramOutput {
        try {
            let ctx = new Tokenizer(this.source);
            let node; // TODO add cases to figure out which node it's supposed to be. 
            node.parse(ctx);
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

        // if (mypath.slice(0, mypath.length - 1).length > 0) {
        //     let prefix = mypath.slice(0, mypath.length - 1).join("/");
        //     return path.join(__dirname, "../../resources/build", prefix, program_name);
        // }

        return path.join(__dirname, "../../resources/build", program_name);
    }
}