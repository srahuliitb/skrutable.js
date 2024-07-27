import * as mp from './meterPatterns.js';
import { config } from './config.js';
import { character_set } from './phonemes.js';

const scansion_syllable_separator = config["scansion_syllable_separator"] // e.g. " "
const additional_pAda_separators = config["additional_pAda_separators"]  // e.g. ["\t", ";"]

export class Verse {
  /*
  User-facing patient-style object, basically a bundle of attributes.

	Usually constructed only internally.

	Returned by scansion.Scanner.scan()
	as well as by meter_identification.MeterIdentifier.identify_meter().

	Single method summarize() formats key attributes for display
	whether via command line or graphical user interface.
  */

  text_raw;	// string, may contain newlines
  original_scheme; // string
  text_cleaned; // string, may contain newlines
  text_SLP; // string, may contain newlines
  text_syllabified; // string, may contain newlines
  syllable_weights;	// string, may contain newlines
  morae_per_line; // list of integers
  gaRa_abbreviations;	// string, may contain newlines
  meter_label; // string	
  identification_score = 0;

  /*
  constructor(verseProps) {
    this.text_raw = verseProps.text_raw;
    this.original_scheme = verseProps.original_schemel;
    this.text_cleaned = verseProps.text_cleaned;
    this.text_SLP = verseProps.text_SLP;
    this.text_syllabified = verseProps.text_syllabified;
    this.syllable_weights = verseProps.syllable_weights;
    this.morae_per_line = verseProps.morae_per_line;
    this.gaRa_abbreviations = verseProps.gaRa_abbreviations;
    this.meter_label = verseProps.meter_label;
  }
  */
}

export class Scanner {
  /*
  User-facing agent-style object, basically a bundle of methods.

	Primary method scan() accepts string.
  Returns single Verse object populated with scansion results.
  */

  // Mostly agent-style object.
  // These attributes record most recent associated objects
  Verse; // will hold Verse object
	Transliterator;	// will hold Transliterator object

  clean_input(cntnts, scheme_in) {
    /*
    Accepts raw text string,
		filters out characters not relevant to scansion,
		with exception of whitespace (space, tab, newline).

		Returns result as string.
    */

    // manage additional newlines
		for (const chr in additional_pAda_separators) {
      cntnts = cntnts.replace(chr, '\n');
    }

		// also dedupe, also allowing for carriage returns introduced in HTML form input
		// Replace multiple newlines with a single newline
    const regex = /\n{2,}/g;
    cntnts = cntnts.replace(regex, '\n');

    // Remove leading and trailing whitespace
    cntnts = cntnts.trim();

		// filter out disallowed characters just for SLP
    const uniqueCharactersArray = [...new Set(cntnts)];
		uniqueCharactersArray.forEach((c) => {
      if (!(c in character_set[scheme_in])) {
        cntnts = cntnts.replace(c, '');
      }
    });
    
		return cntnts
  }

}

// const sc = new Scanner();
// let input_string = `
//   yadA yadA hi Darmasya
//   glAnirBavati BArata
//   aByutTAnamaDarmasya
//   tadAtmAnaM sfjAmyaham
// `;

// sc.clean_input(input_string, 'SLP');
// console.log(input_string);