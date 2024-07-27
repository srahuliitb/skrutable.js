const roman_schemes_1 = ['IAST', 'SLP', 'HK'];
const all_schemes = roman_schemes_1;
// const indic_schemes = ['DEV', 'BENGALI', 'GUJARATI'];
// const roman_schemes_2 = ['VH', 'ITRANS', 'IASTREDUCED'];
// const all_schemes = roman_schemes_1.concat(indic_schemes).concat(roman_schemes_2);

/*
For reference, each scheme on its own:
IAST					      SLP						      HK
a ā i ī u ū				  a A i I u U 			  a A i I u U
ṛ ṝ ḷ ḹ e ai o au		f F x X e E o O 		R RR lR lRR e ai o au
k kh g gh ṅ				  k K g G N 				  k kh g gh G
c ch j jh ñ				  c C j J Y 				  c ch j jh J
ṭ ṭh ḍ ḍh ṇ				  w W q Q R 				  T Th D Dh N
t th d dh n				  t T d D n 				  t th d dh n
p ph b bh m				  p P b B m 				  p ph b bh m
y r l v					    y r l v 				    y r l v
ś ṣ s h ṃ ḥ '			S z s h M H '			    z S s h M H '

(IASTREDUCED: a a i i u u ... jh n t th d dh n t ... s s s h m h ')

/*
Available Mappings
to SLP   IAST_SLP, DEV_SLP, HK_SLP, VH_SLP, ITRANS_SLP
(SLP_SLP)
from SLP  SLP_IAST, SLP_DEV, SLP_HK, SLP_VH, SLP_ITRANS
*/

const SLP_SLP = [
  // Normalization 1: avagraha
  ("’", "'"),
]

const by_name = {
'IAST_SLP' : IAST_SLP, 'HK_SLP' : HK_SLP,
'DEV_SLP' : DEV_SLP, 'BENGALI_SLP' : BENGALI_SLP, 'GUJARATI_SLP' : GUJARATI_SLP,
'VH_SLP' : VH_SLP, 'WX_SLP' : WX_SLP,
'ITRANS_SLP': ITRANS_SLP,
'SLP_SLP' : SLP_SLP,
'SLP_IAST' : SLP_IAST, 'SLP_HK' : SLP_HK,
'SLP_DEV' : SLP_DEV, 'SLP_BENGALI' : SLP_BENGALI, 'SLP_GUJARATI' : SLP_GUJARATI,
'SLP_VH' : SLP_VH, 'SLP_WX' : SLP_WX, 'SLP_ITRANS' : SLP_ITRANS,
'SLP_IASTREDUCED' : SLP_IASTREDUCED,
}