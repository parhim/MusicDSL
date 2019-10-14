import IProgram from './IProgram';
import Tokenizer from "../parser/Tokenizer";
import { Node } from "../parser/Node";
import * as fs from "fs";
import * as path from "path";
import KeyWords, { Punctuation, Tokens } from '../parser/KeyWords';
import {ParserError} from '../errors/ParserError';
import Rhythmic from "../parser/Rhythmic";
import Melodic from "../parser/Melodic";
import Section from "../parser/Section";
import VarUse from '../parser/VarUse';
import SymbolTable from '../parser/SymbolTable';
import Return from '../parser/Return';
import Song from '../model/Song';
import { OutputWriter } from './OutputWriter';

export class MusicProgram implements IProgram {

    source: string;
    nodes: Node[];
    name: string;
    song: any;


    constructor(source: string) {
        this.source = source;
        this.nodes = [];
        this.name = "";
    }

    public parse(): void {
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
                context.pop();
                node = new Section()
            }
            else if (Tokens.RETURN == nextToken){
                context.pop();
                node = new Return();
            }
            else {
                console.log(context);
                throw new ParserError(`Unrecognizable token: ${nextToken}`);
            }
            this.nodes.push(node);
            node.parse(context);
        }
    }

    public compile(): void {
        this.nodes.forEach(node => {
            this.song = node.compile();
        });
        let final: Song = {
            Title: this.name,
            Song: this.song
        }
        let writer = OutputWriter.getInstance("song.json", 'utf-8');
        writer.write(JSON.stringify(final));
        writer.flush();
    }

    public initializeSong(context: Tokenizer) {
        context.getAndCheckNext(Tokens.CREATESONG);
        context.getAndCheckNext(Punctuation.L_PAREN);
        let name = "";
        while(context.hasNext() && context.top() !== Punctuation.R_PAREN) {
            name += context.pop();
        }
        this.name = name;
        context.getAndCheckNext(Punctuation.R_PAREN);
        context.getAndCheckNext(Punctuation.COLON);
    }
}