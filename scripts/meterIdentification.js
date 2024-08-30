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
      Vrs.meter_label += ` atha vā ${new_label}`;
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

  count_pAdasamatva(Vrs) {
    /*
    Accepts four-part (newline-separated) string of light/heavy (l/g) pattern.
		Since testing for samavṛtta, ignores final anceps syllable in each part.
		Returns integer 0,2,3,4 indicating size of best matching group.
    */

    this.pAdasamatva_count = 0;

    // prepare weights-by-pāda for samatva count: omit last anceps syllable
    let wbp = [];
    Vrs.syllable_weights.split('\n').forEach((true_wbp) => {
      wbp.push(true_wbp.slice(0, true_wbp.length - 1));
    });

    // make sure full four pādas
    try {
      wbp[3] !== null;
    } catch(error) {
      console.log('Number of pādas is less than 4');
    }

    // avoid false positive if completely empty string argument list
    if (wbp[0] === '' && wbp[1] === '' && wbp[2] === '' && wbp[3] === '') {
      return 0;
    }

    // discard any empty strings
    wbp = wbp.filter(char => char !== '');

    // calculate max number of matching pādas in verse
    const wbp_counts_array = [];
    for (let i = 0; i < wbp.length; i++) {
      let temp = 0;
      wbp.forEach((c) => {
        if (c === wbp[i]) {
          temp += 1;
        }
        wbp_counts_array.push(temp);
      });
    }

    const max_match = Math.max(...wbp_counts_array);

    if (max_match === 2 || max_match === 3 || max_match === 4) {
      this.pAdasamatva_count = max_match;
    }
  }

}

export class MeterIdentifier {
  /*
  User-facing agent-style object.

	Primary method identify_meter() accepts string.

	Returns single Verse object, whose attribute meter_label
	and method summarize() help in revealing identification results.
  */
  Scanner = null;
  VerseTester = null;
  Verses_found = [];

  wiggle_iterator(start_pos, part_len, resplit_option) {
    /*
    E.g., if 'pāda'.length === 10, then from the breaks between each pāda,
		wiggle as far as 6 in either direction, first right, then left.
    */
    let iter_list = [start_pos];
    let distance_multiplier = 0;
    if (resplit_option === 'resplit_max') {
      distance_multiplier = 0.5; // wiggle as far as 50% of part_len
    } else if (resplit_option === 'resplit_lite') {
      distance_multiplier = 0.35;
    }
    const max_wiggle_distance = Math.floor(part_len * distance_multiplier + 1);
    for (i = 1; i < max_wiggle_distance; i++) {
      iter_list.push(start_pos + i);
      iter_list.push(start_pos - i);
    }
    return iter_list;
  }

  resplit_Verse() {
    // TODO
  }

  wiggle_identity() {
    // TODO
  }

  identify_meter() {
    // TODO
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