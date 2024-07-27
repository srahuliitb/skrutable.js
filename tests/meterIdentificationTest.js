import { Scanner } from '../scripts/scansion.js';
import { VerseTester } from '../scripts/meterIdentification.js';
import * as mp from '../scripts/meterPatterns.js';
import { config } from '../scripts/config.js';

describe('test suite: test_as_anuzwuB', () => {

  const disable_non_trizwuB_upajAti = config["disable_non_trizwuB_upajAti"];
  const meter_scores = config["meter_scores"]; // dict
 
  it('should return anuṣṭubh (1,2: pathyā, 3,4: pathyā)', () => {
    const scanner = new Scanner();
    const verseDetails = {
      pAdasamatva_count: 0,
      resplit_option: '', // String
      resplit_keep_midpoint: false, // Boolean
      identification_attempt_count: 0
    };
    const VT = new VerseTester(verseDetails);
    const input_string = `
      yadA yadA hi Darmasya
      glAnirBavati BArata
      aByutTAnamaDarmasya
      tadAtmAnaM sfjAmyaham
    `;
    const V = S.scan(input_string, from_scheme='SLP');
    VT.test_as_anuzwuB(V);
    const output = V.meter_label;
    const expected_output = "anuṣṭubh (1,2: pathyā, 3,4: pathyā)";
    expect(output).toEqual(expected_output);
  });
});