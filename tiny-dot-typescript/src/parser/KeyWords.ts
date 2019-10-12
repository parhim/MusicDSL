const Tokens = {
    IDENTIFIER: "[_A-Za-z]+([A-Za-z0-9]*)",
    CREATESONG: "createsong",
    KICK: "Kick",
    SNARE: "Snare",
    ORGAN: "Organ",
    SECTION: "Section",
    PIPE: "|",
    LOOP: "Loop",
    RETURN: "return",
    INSTRUMENTS: {
        MELODIC: {
            ORGAN: "Organ",
        },
        RHYTHMIC: {
            KICK: "Kick",
            SNARE: "Snare",
        }
    },
    PUNCTUATION: {
        LEFTPARENTHESIS: "(",
        RIGHTPARENTHESIS: ")",
        COLON: ":",
        COMMA: ",",
    }
}

export const notes = {
    RHYTHMIC: {
        ZERO: 0,
        ONE: 1
    },
    MELODIC: {
        A: "A",
        B: "B",
        C: "C",
        D: "D", 
        E: "E",
        F: "F",
        CMAJ: "Cmaj",
        CMAJ7: "Cmaj7"
        // TODO add more..
    }

}



export default Tokens;
