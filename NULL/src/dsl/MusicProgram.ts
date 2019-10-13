import IProgram from './IProgram';
import ProgramOutput from "./ProgramOutput";
import { ProgramOutputStatus } from "./ProgramOutput";
import Tokenizer from "../parser/Tokenizer";
import { Node } from "../parser/Node";
import * as fs from "fs";
import * as path from "path";
import KeyWords, { Punctuation, Tokens } from '../parser/KeyWords';
import {ParserError} from '../errors/ParserError';
import Rhythmic from "../parser/Rhythmic";
import Melodic from "../parser/Melodic";

export class MusicProgram implements IProgram {

    source: string;
    nodes: Node[];
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
                    if (Tokens.INSTRUMENTS.MELODIC.GUITAR == nextToken || Tokens.INSTRUMENTS.MELODIC.ORGAN == nextToken) {
                        node = new Melodic();
                    } else {
                        node = new Rhythmic();
                    }
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
                this.nodes.push(node);
                node.parse(context);
            }
            return new ProgramOutput(ProgramOutputStatus.SUCCESS, null);
        } catch (err) {
            return new ProgramOutput(ProgramOutputStatus.ERROR, err);
        }


    }

    public compile(): ProgramOutput {
        try{
            this.nodes.forEach(node => {
                node.compile();
            });
        } catch(err){
            return new ProgramOutput(ProgramOutputStatus.ERROR, err);
        }
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