import * as chai from 'chai';
import * as fs from 'fs';

import {MusicProgram} from '../../src/dsl/MusicProgram';
import {OutputWriter} from '../../src/dsl/OutputWriter';
import * as path from "path";


const expect = chai.expect;

// const compile = (dotProgram: MusicProgram): ProgramOutput => {
//     let output = dotProgram.compile();

//     if (ProgramOutputStatus.ERROR == output.status) {
//         for (let err of output.errors) {
//             console.log(err.message);
//         }
//     }

//     return output;

// };

const load = (expectedOutput: string): string => {
    this.program = fs.readFileSync(path.join(__dirname, "../../resources", expectedOutput)).toString('utf-8');
    return this.program;
};

describe('DSL should be able to compile', () => {

    before(() => {

    });

    it('should compile a valid input', async () => {
        let dotProgram = new MusicProgram("grammarsamples/grammar.txt");
        dotProgram.parse();
        dotProgram.compile();
        // let outputString = load("valid/output/sample.dot");
        // expect(output.status).to.be.equal(ProgramOutputStatus.SUCCESS);
        // expect(fs.readFileSync(dotProgram.targetPath()).toString('utf-8')).to.be.equal(outputString);
        // OutputWriter.tearDown();
    });


    it('should compile LifeUniverseAndEverythingElse input', async () => {

        // let dotProgram = new MusicProgram("valid/LifeUniverseAndEverythingElse.tdot");
        // let output = compile(dotProgram);
        // let outputString = load("valid/output/LifeUniverseAndEverythingElse.dot");
        // expect(output.status).to.be.equal(ProgramOutputStatus.SUCCESS);
        // expect(fs.readFileSync(dotProgram.targetPath()).toString('utf-8')).to.be.equal(outputString);
        // OutputWriter.tearDown();
    });
});