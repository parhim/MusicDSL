
export default class KeyWords{

    public static Tokens = {
        IDENTIFIER: "[_A-Za-z]+([A-Za-z0-9]*)",
        CREATESONG: "createsong",
        SECTION: "Section",
        PIPE: "|",
        LOOP: "Loop",
        RETURN: "return",
        INSTRUMENTS: {
            MELODIC: {
                ORGAN: "Organ",
                GUITAR: "Guitar"
            },
            RHYTHMIC: {
                KICK: "Kick",
                SNARE: "Snare",
                HAT: "Hihat"
            }
        },
        PUNCTUATION: {
            L_PAREN: "(",
            R_PAREN: ")",
            COLON: ":",
            COMMA: ",",
            QUOTE: "\"",
            EQUAL: "=",
        }
    }

    public static Notes = {
        RHYTHMIC: {
            ZERO: 0,
            ONE: 1
        },
        MELODIC: {
            C: 60,
            D: 62,
            E: 64,
            F: 65,
            FSHARP: 66,
            G: 67,
            A: 69,
            B: 71,
            CMAJ: "Cmaj",
            GMAJ: "Gmaj",
            FMAJ: "Fmaj",
            DMAJ: "Dmaj",
            AMIN: "Amin",
            EMIN: "Emin"
        }
    
    }

    public static isInstrument(term: string): boolean {
        let MELODIC, RHYTHMIC;
        Tokens.INSTRUMENTS = {MELODIC, RHYTHMIC} 
        term = term.toUpperCase();
        return MELODIC[term] || RHYTHMIC[term];
    }
}


export const Tokens = KeyWords.Tokens;
export const Punctuation = KeyWords.Tokens.PUNCTUATION;
export const Notes = KeyWords.Notes;
export const MeasureLength = 8;