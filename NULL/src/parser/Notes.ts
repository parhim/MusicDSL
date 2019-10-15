import {Node} from "./Node";
import Tokenizer from "../parser/Tokenizer";
import {ParserError} from '../errors/ParserError';
import {CompileError} from "../errors/CompileError";
import KeyWords, {MeasureLength, Punctuation} from "./KeyWords";
import SymbolTable from "./SymbolTable"

export default class Notes extends Node {
    melodicInstrument: String;
    name: String;

    first = [];
    third = [];
    fifth = [];
    seventh = [];

    melNotes = KeyWords.Notes.MELODIC;

    constructor(name: String, melodicInstrument: String) {
        super();
        this.melodicInstrument = melodicInstrument;
        this.name = name;
    }

    public parse(context: Tokenizer) {

        let cont = true;
        while (context.hasNext() && cont) {
            let nextNote = context.pop();

            if (+nextNote === KeyWords.Notes.RHYTHMIC.ZERO) {
                this.addChord(0,0,0,0);
            } else {
                switch (nextNote) {
                    case this.melNotes.CMAJ:
                        this.addChord(this.melNotes.C, this.melNotes.E, this.melNotes.G, 0);
                        break;
                    case this.melNotes.CMAJ7:
                        this.addChord(this.melNotes.C, this.melNotes.E, this.melNotes.G, this.melNotes.B);
                        break;
                    case this.melNotes.GMAJ:
                        this.addChord(this.melNotes.G, this.melNotes.B, this.melNotes.D, 0);
                        break;
                    case this.melNotes.FMAJ:
                        this.addChord(this.melNotes.F, this.melNotes.A, this.melNotes.C, 0);
                        break;
                    case this.melNotes.DMAJ:
                        this.addChord(this.melNotes.D, this.melNotes.FSHARP, this.melNotes.A, 0);
                        break;
                    case this.melNotes.AMIN:
                        this.addChord(this.melNotes.A, this.melNotes.C, this.melNotes.E, 0);
                        break;
                    case this.melNotes.EMIN:
                        this.addChord(this.melNotes.E, this.melNotes.G, this.melNotes.B, 0);
                        break;
                    default:
                        throw new ParserError(`Line ${context.getLine()} Invalid note: ${nextNote}`);
                }
            }

            let comma = context.top();
            if (comma != Punctuation.COMMA) {
                cont = false;
            } else {
                context.pop();
            }
        }

        if (this.first.length != MeasureLength || this.third.length != MeasureLength 
            || this.fifth.length != MeasureLength || this.seventh.length != MeasureLength)
        {
            throw new ParserError(`Line ${context.getLine()} Notes must be of length 8`);
        }
    }

    private addChord(first: Number, third: Number, fifth: Number, seventh: Number) {
        this.first.push(first);
        this.third.push(third);
        this.fifth.push(fifth);
        this.seventh.push(seventh);
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
                    },
                    {
                        "Instrument" : this.melodicInstrument,
                        "Notes" : this.seventh
                    }
                ]);
        } catch (err) {
            throw new CompileError(err.message);
        }
    }
}