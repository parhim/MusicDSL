import { Punctuation } from './KeyWords';
import * as fs from 'fs';
import * as path from 'path';
import {ParserError} from '../errors/ParserError';

export default class Tokenizer {

    program: string;

    tokens: string[];

    currentTokenIdx: number;

    line: number;

    column: number;

    constructor(fileName: string) {
        try {
            this.program = fs.readFileSync(path.join(__dirname, "../../resources", fileName)).toString('utf-8');
        } catch (err) {
            throw new ParserError(`Unable to load source: ${fileName}`);
        }
        this.tokenize();
    }

    private tokenize() {
        // Replace weird directional quotes
        this.program = this.program.replace(/“|”/g, "\"");
        
        // Put spaces around punctuation
        let puncts = Object.keys(Punctuation);
        puncts.forEach((punct) => {
            let p = Punctuation[punct];
            let re = new RegExp(`\\${p}`, "g");
            this.program = this.program.replace(re, ` ${p} `);
        })

        // Split into tokens
        this.tokens = this.program.split('\n').join(' NEW_LINE ').match(/\S+/g) || [];
        this.currentTokenIdx = 0;
        this.line = 1;
        this.column = 0;
    }

    public top(): string {
        if (this.currentTokenIdx < this.tokens.length) {
            // ignore blank lines
            while ("NEW_LINE" === this.tokens[this.currentTokenIdx]) {
                this.currentTokenIdx += 1;
                this.line += 1;
                this.column = 0;
            }

            return this.tokens[this.currentTokenIdx];
        }

        return null;
    }

    public pop(): string {
        if (this.top() != null) {
            let token = this.tokens[this.currentTokenIdx];
            this.currentTokenIdx += 1;
            this.column += 1;
            return token;
        }
        return null;
    }

    public hasNext(): boolean {
        return this.top() !== null;
    }

    public getLine(): number {
        return this.line;
    }

    public checkNext(t: String): String {
        const s = this.top();
        if (s != t) {
            throw new ParserError(`Line ${this.line} Unexpected token: ${s}, Expected token: ${t}`);
        }
        return s;
    }

    public getAndCheckNext(t: string): String {
        const s = this.pop();
        if(s != t){
            throw new ParserError(`Line ${this.line} Unexpected token: ${s}, Expected token: ${t}`);
        }
        return s; 
    }
    public getAndCheckNextReg(t: RegExp): String {
        const s = this.pop();
        if (!s.match(t)) {
            throw new ParserError(`Line ${this.line} Unexpected token: ${s}, Expected token: ${t}`);
        }
        return s;
    }
    
    public checkNextReg(t: RegExp): String {
        const s = this.top();
        if (!s.match(t)) {
            throw new ParserError(`Line ${this.line} Unexpected token: ${s}, Expected token: ${t}`);
        }
        return s;
    }
}