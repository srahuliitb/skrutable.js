import { Scanner } from '../scripts/scansion.js';
import * as mp from '../scripts/meterPatterns.js';
import { config } from '../scripts/config.js';

// const scansion_syllable_separator = config["scansion_syllable_separator"] // e.g. " "
// const additional_pAda_separators = config["additional_pAda_separators"]  // e.g. ["\t", ";"]

describe('test suite: Scanner', () => {
  let input_string;
  let scanner;
  beforeEach(() => {
    input_string = `
      yadA yadA hi Darmasya |
      glAnirBavati BArata;
      aByutTAnamaDarmasya,
      tadAtmAnaM sfjAmyaham ।
    `;
    scanner = new Scanner();
  });

  it('should return a clean input', () => {    
    const output = scanner.clean_input(input_string, 'SLP');
    const expected_output = 'yadA yadA hi Darmasya\nglAnirBavati BArata\naByutTAnamaDarmasya\ntadAtmAnaM sfjAmyaham';

    expect(output).toEqual(expected_output);
  });

  it('should return the syllabified text for a clean input text', () => {
    const clean_input = scanner.clean_input(input_string, 'SLP');
    const output = scanner.syllabify_text(clean_input);
    const expected_output = `ya dA ya dA hi Da rma sya\nglA ni rBa va ti BA ra ta\na Byu tTA na ma Da rma sya\nta dA tmA naM sf jA mya ham`;

    // console.log(output);
    // console.log(expected_output);
    expect(output).toEqual(expected_output);
  });

});