import {Node} from "./Node";
import Tokenizer from "../parser/Tokenizer";
import {ParserError} from '../errors/ParserError';
import {CompileError} from "../errors/CompileError";
import {OutputWriter} from "../dsl/OutputWriter";
import KeyWords, {MeasureLength, Punctuation} from "./KeyWords";
import SymbolTable from "./SymbolTable"

export default class Notes extends Node {
    melodicInstrument: String;
    name: String;

    first = [];
    third = [];
    fifth = [];

    melNotes = KeyWords.Notes.MELODIC;

    constructor(name: String, melodicInstrument: String) {
        super();
        this.melodicInstrument = melodicInstrument;
        this.name = name;
    }

    public parse(context: Tokenizer) {

        let lineNum = context.getLine();

        while (context.hasNext() && (lineNum == context.getLine())) {
            let nextNote = context.pop();

            if (+nextNote == KeyWords.Notes.RHYTHMIC.ZERO) {
                this.addChord(0,0,0);
            }

            switch (nextNote) {
                case this.melNotes.CMAJ:
                    this.addChord(this.melNotes.C, this.melNotes.E, this.melNotes.G);
                    break;
                case this.melNotes.GMAJ:
                    this.addChord(this.melNotes.G, this.melNotes.B, this.melNotes.D);
                    break;
                case this.melNotes.FMAJ:
                    this.addChord(this.melNotes.F, this.melNotes.A, this.melNotes.C);
                    break;
                case this.melNotes.DMAJ:
                    this.addChord(this.melNotes.D, this.melNotes.FSHARP, this.melNotes.A);
                    break;
                case this.melNotes.AMIN:
                    this.addChord(this.melNotes.A, this.melNotes.C, this.melNotes.E);
                    break;
                case this.melNotes.EMIN:
                    this.addChord(this.melNotes.E, this.melNotes.G, this.melNotes.B);
                    break;
            }

            let comma = context.pop();
            if (comma != Punctuation.COMMA) {
                throw new ParserError("Notes must be separated with commas")
            }
        }

        if (this.first.length != MeasureLength || this.third.length != MeasureLength || this.fifth.length != MeasureLength)
        {
            throw new ParserError("Notes must be of length 8")
        }
    }

    private addChord(first: Number, third: Number, fifth: Number) {
        this.first.push(first);
        this.third.push(third);
        this.fifth.push(fifth);
    }

    public compile() {
        try {
            SymbolTable.set(this.name,
                [
                    {
                        "Instrument" : this.melodicInstrument,
                        "Notes" : this.first
                    },
                    {
                        "Instrument" : this.melodicInstrument,
                        "Notes" : this.third
                    },
                    {
                        "Instrument" : this.melodicInstrument,
                        "Notes" : this.fifth
                    }
                ]);
        } catch (err) {
            throw new CompileError(err.message);
        }
    }
}