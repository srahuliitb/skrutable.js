import { Scanner } from '../scripts/scansion.js';

describe('test suite: Scanner class methods', () => {
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

    expect(output).toEqual(expected_output);
  });

  it('should return a combination of l and g patters for each line', () => {
    const clean_input = scanner.clean_input(input_string, 'SLP');
    const syl_text = scanner.syllabify_text(clean_input);
    const output = scanner.scan_syllable_weights(syl_text);
    const expected_output = `lglglggl\ngglllgll\ngggllggl\nlggglglg`;
    expect(output).toEqual(expected_output);
  });

  it('should return an array of integers', () => {
    const clean_input = scanner.clean_input(input_string, 'SLP');
    const syl_text = scanner.syllabify_text(clean_input);
    const syl_weights = scanner.scan_syllable_weights(syl_text);
    const output = scanner.count_morae(syl_weights);
    const expected_output = [12, 11, 13, 13];
    expect(output).toEqual(expected_output);
  });

  /*
  it('should return a string of gaRa abbreviations', () => {
    const clean_input = scanner.clean_input(input_string, 'SLP');
    const syl_text = scanner.syllabify_text(clean_input);
    const syl_weights = scanner.scan_syllable_weights(syl_text);
    const output = scanner.gaRa_abbreviate(syl_weights);
    const expected_output = "jrgl\ntsll\nmsgl\nyrlg";
    expect(output).toEqual(expected_output);
  });
  */

});