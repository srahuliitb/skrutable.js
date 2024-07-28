import * as mp from './meterPatterns.js';
import { config } from './config.js';

// console.log(config)
const scansion_syllable_separator = config["scansion_syllable_separator"]; // e.g. " "
const default_resplit_option = config["default_resplit_option"]; // e.g. "none"
const default_resplit_keep_midpoint = config["default_resplit_keep_midpoint"]; // e.g. True
const disable_non_trizwuB_upajAti = config["disable_non_trizwuB_upajAti"]; // e.g. True
const meter_scores = config["meter_scores"] // dict

// console.log(scansion_syllable_separator);
// console.log(default_resplit_option);
// console.log(default_resplit_keep_midpoint);
// console.log(disable_non_trizwuB_upajAti);
// console.log(meter_scores);

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
  
  constructor(verseDetails) {
    self.resplit_option = verseDetails.resplit_option;
    self.resplit_keep_midpoint = verseDetails.resplit_keep_midpoint;
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
    // TODO
    /**
     * Accepts two strings of syllable weights (e.g. 'llglgllg').
     * Tries to match to known odd-even 'anuṣṭubh' foot pairings:
     *  pathya
     *  vipulā (4.5 subtypes: na, ra, ma, bha, and variant bha).
     * Returns string result if match found, None otherwise.
     */
    
    // check even pāda
    const even_anuzwuB_pAda = mp.even_anuzwuB_pAda;
		const regex = re.compile(even_anuzwuB_pAda);
		if (!re.match(regex, even_pAda_weights)) {
      return undefined;
    }

		// check odd pāda (both 'paTyA' and 'vipulA')
		const odd_anuzwuB_pAda = mp.odd_anuzwuB_pAda;
    for (const weights_pattern in odd_anuzwuB_pAda) {
      const regex = re.compile(weights_pattern[weights_pattern][0]);
      if (re.match(regex, odd_pAda_weights)) {
        return odd_anuzwuB_pAda[weights_pattern];
      }
    }

    return undefined;
  }

  test_as_anuzwuB(Vrs) {
    
  }

}


