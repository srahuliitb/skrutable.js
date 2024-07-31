import * as mp from './meterPatterns.js';
import { config } from './config.js';
import { Verse, Scanner } from './scansion.js';

const scansion_syllable_separator = config["scansion_syllable_separator"]; // e.g. " "
const default_resplit_option = config["default_resplit_option"]; // e.g. "none"
const default_resplit_keep_midpoint = config["default_resplit_keep_midpoint"]; // e.g. True
const disable_non_trizwuB_upajAti = config["disable_non_trizwuB_upajAti"]; // e.g. True
const meter_scores = config["meter_scores"] // dict

export class VerseTester {
  /**
   * Internal agent-style object.
   * Most methods take a populated scansion.Verse object as an argument;
   * test_as_anuzwuB_half() is an exception.
   * Primary method attempt_identification returns scansion.Verse object
   * with populated meter_label attribute if identification was successful.
   */
  pAdasamatva_count = 0;
  resplit_option; // String
  resplit_keep_midpoint // Boolean
  identification_attempt_count = 0;
  
  constructor(resplit_option, resplit_keep_midpoint) {
    self.resplit_option = resplit_option;
    self.resplit_keep_midpoint = resplit_keep_midpoint;
  }

  combine_results(Vrs, new_label, new_score) {
    const old_label = Vrs.meter_label || '';
		const old_score = Vrs.identification_score;

		// currently strict
		// another more lenient option would test: abs(new_score - old_score) <= 1

		if (new_score < old_score) {
      return;
    } else if (new_score > old_score) {
			// override previous
			Vrs.meter_label = new_label;
			Vrs.identification_score = new_score;

    } else if (new_score === old_score) {
			// tie, concatenate as old + new
				Vrs.meter_label += " atha vā " + new_label;
			// do not change score
    }
  }

  test_as_anuzwuB_half(odd_pAda_weights, even_pAda_weights) {
    /**
     * Accepts two strings of syllable weights (e.g. 'llglgllg').
     * Tries to match to known odd-even 'anuṣṭubh' foot pairings:
     *  pathya
     *  vipulā (4.5 subtypes: na, ra, ma, bha, and variant bha).
     * Returns string result if match found, null otherwise.
     */

    // check even pāda
    const even_pAda_regex = new RegExp(mp.even_anuzwuB_pAda);
    if (!even_pAda_regex.test(even_pAda_weights)) {
      return null;
    }

		// check odd pāda (both 'paTyA' and 'vipulA')
    for (const weights_pattern in mp.odd_anuzwuB_pAda) {
      const odd_pAda_regex = new RegExp(weights_pattern);
      if (odd_pAda_regex.test(odd_pAda_weights)) {
        return mp.odd_anuzwuB_pAda[weights_pattern];
      }
    }

    return null;
  }

  test_as_anuzwuB(Vrs) {
    /*
    Accepts Verse object.
		Determines whether first four lines of Verse's syllable_weights is anuṣṭubh.
		Internally sets Verse parameters if identified as such.
		Tests halves ab and cd independently, reports if either half found to be valid.
		Returns 1 if anuṣṭubh, or 0 if not.
    */

    const w_p = Vrs.syllable_weights.split('\n'); // weights by pāda  
    
    try {
      const fourth_pAda = w_p[3];
    } catch (IndexError) {
      console.log('The verse does not have all 4 pAdas');
    }

    // test each half
		let pAdas_ab = this.test_as_anuzwuB_half(w_p[0], w_p[1]);
		let pAdas_cd = this.test_as_anuzwuB_half(w_p[2], w_p[3]);

    // report results
		// both halves perfect
    if (pAdas_ab !== null && pAdas_cd !== null) {
      Vrs.meter_label = `anuṣṭubh (1,2: ${pAdas_ab}, 3,4: ${pAdas_cd})`;
			Vrs.identification_score = meter_scores["anuṣṭubh, full, both halves perfect)"];
			return 1;
    } else if (pAdas_ab === null && pAdas_cd !== null) {
      Vrs.meter_label = `anuṣṭubh (1,2: asamīcīna, 3,4: ${pAdas_cd})`;
			Vrs.identification_score = meter_scores["anuṣṭubh, full, one half perfect, one imperfect)"];
			return 1;
    } else if (pAdas_ab !== null && pAdas_cd == null) {
      Vrs.meter_label = `anuṣṭubh (1,2: ${pAdas_ab}, 3,4: asamīcīna)`;
			Vrs.identification_score = meter_scores["anuṣṭubh, full, one half perfect, one imperfect)"];
			return 1;
    }

    // currently cannot do both halves imperfect
		// also test whether just a single perfect half
    pAdas_ab = this.test_as_anuzwuB_half(w_p[0] + w_p[1], w_p[2] + w_p[3]);
    
		if (pAdas_ab !== null) {
			Vrs.meter_label = `anuṣṭubh (ardham eva: ${pAdas_ab})`;
			Vrs.identification_score = meter_scores["anuṣṭubh, half, single half perfect)"];
			return 1;
    }
		
    // currently cannot do just a single imperfect half

		return 0;
  }

}

/*
const sc = new Scanner();
let input_string = `
  yadA yadA hi Darmasya
  glAnirBavati BArata
  aByutTAnamaDarmasya
  tadAtmAnaM sfjAmyaham
`;


const clean_text = sc.clean_input(input_string, 'SLP');
console.log(clean_text);

const syllabified_text = sc.syllabify_text(clean_text);
console.log(syllabified_text);

const syllable_weights = sc.scan_syllable_weights(syllabified_text);
console.log(syllable_weights);

const morae_per_line = sc.count_morae(syllable_weights);
console.log(morae_per_line);

syllable_weights.split('\n').forEach((w) => {
  const overall_abbreviation = sc.gaRa_abbreviate(w);
  console.log(overall_abbreviation);
});

const verse = sc.scan(input_string);
console.log(verse);

const verseTester = new VerseTester(default_resplit_option, default_resplit_keep_midpoint);

const result1 = verseTester.test_as_anuzwuB_half('lglglgll', 'gglllgll');
console.log(result1);

const result2 = verseTester.test_as_anuzwuB_half('gggllgll', 'lggglgllg');
console.log(result1);

const result3 = verseTester.test_as_anuzwuB(verse);
console.log(result3);
*/