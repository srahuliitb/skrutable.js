/**
 * The Python dictionariers are represented as JS objects. Can be convert into a JSON object using JSON.stringify() method
 */

// traditional "gaṇa" trisyllable abbreviation scheme
export const gaRas_by_weights = {
  'lgg' : 'y', // bacchius (yagan)
  'ggg' : 'm', // molossus (magan)
  'ggl' : 't', // antibacchius (tagan)
  'glg' : 'r', // cretic or amphimacer (ragan)
  'lgl' : 'j', // amphibrach (jagan)
  'gll' : 'B', // dactyl (bhagan)
  'lll' : 'n', // tribrach (nagan)
  'llg' : 's', // anapest or antidactylus (sagan)
};

/* 
Sources:
		Apte, V.S. (1890). Practical Sanskrit-English Dictionary, "Appendix A: Sanskrit Prosody".
			PDF online @ https://archive.org/details/ldpd_7285627_000/page/n1195/mode/2up
		Hahn, M. (2014). "Brief introduction into the Indian metrical system (for the use of students)"
			PDF online @ https://uni-marburg.academia.edu/MichaelHahn
		Murthy, G.S.S. (2003). "Characterizing Classical Anuṣṭup: A Study in Sanskrit Prosody".
			https://www.jstor.org/stable/41694750

anuṣṭubh

	Rules for structure of even pāda (more rigid):
	1. Syllables 1 and 8 ALWAYS anceps. ( .xxxxxx. )
	2. Syllables 2 and 3 NEVER both light. ( (?!.ll.)xxxx )
	3. Syllables 2-4 NEVER ra-gaRa (glg). ( (?!.glg)xxxx )
	4. Syllables 5-7 ALWAYS has ja-gaRa (lgl). ( xxxxlgl. )

	Rules for structure of odd pāda:
	1. Syllables 1 and 8 ALWAYS anceps. ( .xxxxxx. )
	2. Syllables 2 and 3 NEVER both light. ( (?!.ll.)xxxx )
	3. Multiple "extensions" (vipulā) to prescribed pattern (pathyā) possible.
*/

export const even_anuzwuB_pAda = '^(?!.ll.|.glg).{4}lgl.$';
export const odd_anuzwuB_pAda = {
  '^(?!.ll.).{4}lgg.$' : 'pathyā',
	'^.glgggg.$' : 'ma-vipulā',
	'^.glggll.$' : 'bha-vipulā',
	'^.ggggll.$' : 'bha-vipulā (ma-gaṇa-pūrvikā!)',
	'^(?!.ll).{3}glll.$' : 'na-vipulā',
	'^(?!.ll).{3}gglg.$' : 'ra-vipulā'
};

//  samavṛtta - Final syllable always anceps (heavy always first in regex).

export const samavftta_family_names = {
  0: "...", 1: "...", 2: "...", 3: "...", // never occur, just for bad input
  4: 'pratiṣṭhā',	5: 'supratiṣṭhā',
  6: 'gāyatrī',	7: 'uṣṇik',
  8: 'anuṣṭubh',	9: 'bṛhatī',
  10: 'paṅkti',	11: 'triṣṭubh',
  12: 'jagatī',	13: 'atijagatī',
  14: 'śakvarī',	15: 'atiśakvarī',
  16: 'aṣṭi', 	17: 'atyaṣṭi',
  18: 'dhṛti', 	19: 'atidhṛti',
  20: 'kṛti',		21: 'prakṛti', 	22: 'ākṛti',	23: 'vikṛti',
  24: 'saṃkṛti',	25: 'atikṛti', 	26: 'utkṛti',
  27: 'daṇḍaka',	28: 'daṇḍaka', 	29: 'daṇḍaka', 	30: 'daṇḍaka',
  31: 'daṇḍaka',	32: 'daṇḍaka',	33: 'daṇḍaka',	34: 'daṇḍaka',
  35: 'daṇḍaka',	36: 'daṇḍaka',	37: 'daṇḍaka',	38: 'daṇḍaka',
};

export function choose_heavy_gaRa_pattern(gaRa_pattern) {
  /*
    e.g., "...(g|l)" > "...g",
		e.g., "...(r|B)" > "...r",
		etc.
  */
  return gaRa_pattern.slice(0, -5) + gaRa_pattern.charAt(gaRaPattern.length - 4);
}

export const samavfttas_by_family_and_gaRa = {
  0: { }, 1: { }, 2: { }, 3: { },

  4: {
      'm(g|l)' : 'kanyā' // also 'gm'
    },

  5: {
      'bg(g|l)' : 'paṅkti'
    },
  
  6: {
      't(y|j)' : 'tanumadhyamā',
      'm(m|t)' : 'vidyullekhā', // also 'vāṇī'
      'n(y|j)' : 'śaśivadanā',
      'y(y|j)' : 'somarājī'
    },
  
  7: {
      'js(g|l)' : 'kumāralalitā',
      'ms(g|l)' : 'madalekhā',
      'nn(g|l)' : 'madhumatī'
    },
  
  8: {
      'nBl(g|l)' : 'gajagati',
      'jrl(g|l)' : 'pramāṇikā',
      'Btl(g|l)' : 'māṇavaka',
      'mmg(g|l)' : 'vidyumālā',
      // 'rjgl' : 'samānikā', // also glrj... ends in light?
    },
  
  9: {
      'nn(m|t)' : 'bhujagaśiṣubhṛtā',
      'sj(r|B)' : 'bhujaṅgasaṅgatā',
      'Bm(s|n)' : 'maṇimadhya'
    },
  
  10: {
      'njn(g|l)' : 'tvaritagati',
      'mBs(g|l)' : 'mattā',
      'Bms(g|l)' : 'rukmavatī'
    },
  
  11: {
      'ttjg(g|l)' : 'indravajrā',
      'jtjg(g|l)' : 'upendravajrā',
      'BBBg(g|l)' : 'dodhaka',
      'mBnl(g|l)' : 'bhramaravilasita',
      'rnrl(g|l)' : 'rathoddhatā',
      'mBtg(g|l)' : 'vātormī',
      'mttg(g|l)' : 'śālinī',
      'rnBg(g|l)' : 'svāgatā'
    }
}