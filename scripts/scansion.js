import * as mp from './meterPatterns.js';
import { config } from './config.js';
import { SLP_long_vowels, SLP_vowels, SLP_consonants_for_scansion, character_set } from './phonemes.js';

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
  // original_scheme; // string
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
	// Transliterator;	// will hold Transliterator object

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

  syllabify_text(txt_SLP) {
    /*
    Accepts (newline-separated) multi-line string of SLP text.

		Syllabifies by maximizing number of open (vowel-final) syllables,
		separating them from one another with scansion_syllable_separator.

		Returns new (newline-separated) multi-line string.
    */

    // e.g. text == 'yadA yadA hi Darmasya glAnir Bavati BArata /\naByutTAnam aDarmasya...'
    // final cleaning for scansion: irrelevant horizontal white space
    txt_SLP = txt_SLP.replace(/\s/g, '');
    txt_SLP = txt_SLP.replace(/\t/g, '');
    // e.g. 'yadAyadAhiDarmasyaglAnirBavatiBArata\naByutTAnamaDarmasya...'

    // treat lines individually (newlines to be restored upon return)
    const text_lines = txt_SLP.split('\n');
    const syllables_by_line = [];

    for (const line of text_lines) {
      // e.g., line == 'yadAyadAhiDarmasyaglAnirBavatiBArata'
      let line_syllables = '';
      
      // place scansion_syllable_separator after vowels
      for (const letter of line) {
        // Exception: M and H as explicit syllable coda
        if (letter === 'M' || letter === 'H') {
          if (line_syllables.endsWith(scansion_syllable_separator)) {
            line_syllables = line_syllables.slice(0, -1);
          }
        }

        line_syllables += letter;

        if (SLP_vowels.includes(letter) || letter === 'M' || letter === 'H') {
          line_syllables += scansion_syllable_separator;
        }
      }

      // e.g. 'ya.dA.ya.dA.hi.Da.rma.sya.glA.ni.rBa.va.ti.BA.ra.ta.'
			// BUT e.g. 'a.Byu.tTA.na.ma.Da.rma.sya.ta.dA.tmA.na.Msf.jA.mya.ha.m'

      try {
        // Remove final scansion_syllable_separator before final consonants
        if (line_syllables.endsWith(...SLP_consonants_for_scansion)) {
          // final separator is incorrect, remove
          const final_separator = line_syllables.lastIndexOf(scansion_syllable_separator);
          line_syllables = line_syllables.slice(0, final_separator) + line_syllables.slice(final_separator + 1);
        }
      } catch (error) {
        console.log('IndexError encounted!');
      }

      line_syllables += scansion_syllable_separator;
      syllables_by_line.push(line_syllables);
    }

    const text_syllabified = syllables_by_line.join('\n');
    return text_syllabified;
  }

  scan_syllable_weights(txt_syl) {
    /*
    Accepts (newline-separated) multi-line string of text
		which is syllabified with scansion_syllable_separator.

		Returns corresponding multi-line string light/heavy (l/g) pattern.
    */

    // treat lines individually (newlines to be restored upon return)
    const text_lines = txt_syl.split('\n');
    const weights_by_line = [];

    for (const line of text_lines) {
      let line_weights = '';
      const syllables = line.split(scansion_syllable_separator);
  
      while (syllables.length > 0 && syllables[syllables.length - 1] === '') {
        syllables.pop(); // in case of final separator(s)
      }

      for (let n = 0; n < syllables.length; n++) {
        const syllable = syllables[n];
  
        if (
          // heavy by nature
          SLP_long_vowels.includes(syllable[syllable.length - 1]) || syllable[syllable.length - 1] === 'M' || syllable[syllable.length - 1] === 'H' ||
  
          // heavy by position
          SLP_consonants_for_scansion.includes(syllable[syllable.length - 1]) ||
          (n < syllables.length - 2 && syllables[n + 1].length > 1 && SLP_consonants_for_scansion.includes(syllables[n + 1][1]))
        ) {
          line_weights += 'g';
          // line_weights += 'g_'; // for visual alignment
          // insofar as two 'l's can equal one 'g', could use this alternative for better visual alignment
        } else {
          line_weights += 'l';
        }
      }
  
      weights_by_line.push(line_weights);
    }
  
    const syllable_weights = weights_by_line.join('\n');
    return syllable_weights;

    // TODO
  }

  count_morae(syl_wts) {
    // TODO
  }

  gaRa_abbreviate(syl_wts) {
    // TODO
  }

  scan(cntnts) {
    let V = new Verse();
    V.text_raw = cntnts;
    V.text_cleaned = this.clean_input(V.text_raw, 'SLP')

		V.text_syllabified = this.syllabify_text(V.text_SLP)
		V.syllable_weights = self.scan_syllable_weights(V.text_syllabified)
		V.morae_per_line = self.count_morae(V.syllable_weights)
    //TODO


    this.Verse = V
    return V
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

sc.clean_input(input_string, 'SLP');
console.log(input_string);
const syllabified_text = sc.syllabify_text(input_string);
console.log(syllabified_text);
const syllable_weights = sc.scan_syllable_weights(syllabified_text);
console.log(syllable_weights);
*/
