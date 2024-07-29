// import * as sm from './schemeMaps.js';

const SLP_short_vowels = ['a','i','u','f','x','ĕ','ŏ']; // latter two exceptions for one-char principle
export const SLP_long_vowels = ['A','I','U','F','X','e','E','o','O'];
export const SLP_vowels = SLP_short_vowels.concat(SLP_long_vowels);

const SLP_vowels_with_mAtrAs = SLP_vowels.slice(1, ); // exclude 'a'

const vowels_that_preempt_virAma = SLP_vowels;

const SLP_unvoiced_consonants = ['k','K','c','C','w','W','t','T','p','P','z','S','s'];
const SLP_voiced_consonants = ['g','G','N','j','J','Y','q','Q','R','d','D','n','b','B','m','y','r','l','v','h'];

const SLP_consonants = SLP_unvoiced_consonants.concat(SLP_voiced_consonants);
// Voice distinguished for sake of destroy_spaces functionality.
// For transliteration, 'consonant' means 'needs virāma if non-vowel follows' (no M H)

export const SLP_consonants_for_scansion = SLP_consonants;
// For scansion, 'consonant' means 'contributes to heaviness of previous vowel' (yes M H)

// build character sets for use in cleaning for scansion
const Roman_upper = [];
const Roman_lower = [];

for (let i = 65; i < 91; i++) {
  Roman_upper.push(String.fromCharCode(i));
}

for (let i = 97; i < 123; i++) {
  Roman_lower.push(String.fromCharCode(i));
}

const Roman_upper_filtered =  Roman_upper.filter((letter) => {
  return (letter !== 'L') && (letter !== 'V') && (letter !== 'Z');
});

const SLP_chars = Roman_upper_filtered.concat(Roman_lower);

export const character_set = {
  'SLP': SLP_chars
  // 'IAST': IAST_chars,
  // 'HK': HK_chars,
  // 'DEV': DEV_chars,
  // 'BENGALI': BENGALI_chars,
  // 'GUJARATI': GUJARATI_chars,
  // 'VH': VH_chars,
  // 'ITRANS': ITRANS_chars
};

const to_add = [' ', '\t', '\n'];
to_add.forEach((c) => {
  SLP_chars.push(c);
});

// console.log(SLP_chars);

