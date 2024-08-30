import { Scanner } from '../scripts/scansion.js';
import { VerseTester, MeterIdentifier } from '../scripts/meterIdentification.js';
import { config } from '../scripts/config.js';

describe('test suite: VerseTester methods', () => {

  const disable_non_trizwuB_upajAti = config["disable_non_trizwuB_upajAti"];
  const meter_scores = config["meter_scores"]; // dict

  let scanner;
  let verseDetails;
  let VT;
  let input_string;

  beforeEach(() => {
    scanner = new Scanner();
    verseDetails = {
      pAdasamatva_count: 0,
      resplit_option: '', // String
      resplit_keep_midpoint: false, // Boolean
      identification_attempt_count: 0
    };
    VT = new VerseTester(verseDetails);
  }); 

  describe('test_as_anuzwuB', () => {
    it('should return anuṣṭubh (1,2: pathyā, 3,4: pathyā)', () => {
      input_string = `
        yadA yadA hi Darmasya
        glAnirBavati BArata
        aByutTAnamaDarmasya
        tadAtmAnaM sfjAmyaham
      `;
      const V = scanner.scan(input_string);
      VT.test_as_anuzwuB(V);
      const output = V.meter_label;
      const expected_output = "anuṣṭubh (1,2: pathyā, 3,4: pathyā)";
      expect(output).toEqual(expected_output);
    });
  });

  describe('count_pAdasamatva', () => {
    it('should return 4', () => {
      input_string = `
        sampUrRakumBo na karoti Sabdam
        arDo Gawo GozamupEti nUnam
        vidvAnkulIno na karoti garvaM
        jalpanti mUQAstu guRErvihInAH
      `;
      const V = scanner.scan(input_string)
      VT.count_pAdasamatva(V);
      const output = VT.pAdasamatva_count; // int
      const expected_output = 4;
      expect(output).toEqual(expected_output);
    });
  });

  describe('count_pAdasamatva_zero', () => {
    it('should return 0', () => {
      input_string = `
        sampUrRakumBo na karoti Sabdam
      `;
      const V = scanner.scan(input_string);
      VT.resplit_option = 'single_pAda';
      VT.count_pAdasamatva(V);
      const output = VT.pAdasamatva_count; // int
      const expected_output = 0;
      expect(output).toEqual(expected_output);
    });
  });

  describe('test_identify_meter_upajAti', () => {
    it('should return upajāti', () => {
      input_string = `
        kolAhale kAkakulasya jAte
        virAjate kokilakUjitaM kim
        parasparaM saMvadatAM KalAnAM
        mOnaM viDeyaM satataM suDIBiH
      `;
      MI = new MeterIdentifier();
      const V = scanner.scan(input_string);
      object_result = MI.identify_meter(input_string, resplit_option = 'resplit_max');
      const output = object_result.summarize();
      const expected_output = 'upajāti';
      expect(output).toEqual(expected_output);
    });
  });
  
});
