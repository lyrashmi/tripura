/* ================= TRANSLITERATION ENGINE ================= */

const devToIastMap = {
    'अ':'a','आ':'ā','इ':'i','ई':'ī','उ':'u','ऊ':'ū',
    'ऋ':'ṛ','ॠ':'ṝ','ऌ':'ḷ','ॡ':'ḹ',
    'ए':'e','ऐ':'ai','ओ':'o','औ':'au',
    'ा':'ā','ि':'i','ी':'ī','ु':'u','ू':'ū',
    'ृ':'ṛ','ॄ':'ṝ','ॢ':'ḷ','ॣ':'ḹ',
    'े':'e','ै':'ai','ो':'o','ौ':'au',
    'क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'ṅ',
    'च':'c','छ':'ch','ज':'j','झ':'jh','ञ':'ñ',
    'ट':'ṭ','ठ':'ṭh','ड':'ḍ','ढ':'ḍh','ण':'ṇ',
    'त':'t','थ':'th','द':'d','ध':'dh','न':'n',
    'प':'p','फ':'ph','ब':'b','भ':'bh','म':'m',
    'य':'y','र':'r','ल':'l','व':'v',
    'श':'ś','ष':'ṣ','स':'s','ह':'h',
    'ं':'ṃ','ः':'ḥ','ऽ':"'",'ँ':'m̐',
    '्':'','़':'',
    '०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9',
    '।':'।','॥':'॥'
};


const iastToDevMap = {
    'a':'अ','ā':'आ','i':'इ','ī':'ई','u':'उ','ū':'ऊ',
    'ṛ':'ऋ','ṝ':'ॠ','ḷ':'ऌ','ḹ':'ॡ','e':'ए','ai':'ऐ','o':'ओ','au':'औ',
    'k':'क','kh':'ख','g':'ग','gh':'घ','ṅ':'ङ',
    'c':'च','ch':'छ','j':'ज','jh':'झ','ñ':'ञ',
    'ṭ':'ट','ṭh':'ठ','ḍ':'ड','ḍh':'ढ','ṇ':'ण',
    't':'त','th':'थ','d':'द','dh':'ध','n':'न',
    'p':'प','ph':'फ','b':'ब','bh':'भ','m':'म',
    'y':'य','r':'र','l':'ल','v':'व',
    'ś':'श','ṣ':'ष','s':'स','h':'ह',
    'ṃ':'ं','ḥ':'ः',"'":'ऽ','m̐':'ँ'
};

const iastVowelMatra = {
    'ā':'ा','i':'ि','ī':'ी','u':'ु','ū':'ू',
    'ṛ':'ृ','ṝ':'ॄ','ḷ':'ॢ','ḹ':'ॣ',
    'e':'े','ai':'ै','o':'ो','au':'ौ'
};

const consonants = new Set(['k','kh','g','gh','ṅ','c','ch','j','jh','ñ','ṭ','ṭh','ḍ','h','ṇ','t','th','d','dh','n','p','ph','b','bh','m','y','r','l','v','ś','ṣ','s','h']);
const vowels = new Set(['a','ā','i','ī','u','ū','ṛ','ṝ','ḷ','ḹ','e','ai','o','au']);

const CONSONANT_SET = 'कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह';
const MATRA_SET = 'ािीुूृॄॢॣेैोौ';
const VOWEL_SET = 'अआइईउऊऋॠऌॡएऐओऔ';

// FIX: Added `ch !== ''` to prevent empty strings from matching in `.includes()`
const isConsonant = ch => ch !== '' && CONSONANT_SET.includes(ch);
const isMatra = ch => ch !== '' && MATRA_SET.includes(ch);
const isIndependentVowel = ch => ch !== '' && VOWEL_SET.includes(ch);
const isDevanagari = ch => { const c = ch.charCodeAt(0); return c >= 0x0900 && c <= 0x097F; };
const getStandaloneVowel = v => iastToDevMap[v] || v;

function devanagariToIAST(input) {
    let result = '';
    let i = 0;
    while (i < input.length) {
        const ch = input[i];
        if (devToIastMap[ch] !== undefined) {
            const mapped = devToIastMap[ch];
            if (isConsonant(ch)) {
                result += mapped;
                if (i + 1 < input.length && input[i + 1] === '्') { i += 2; continue; }
                if (i + 1 < input.length && isMatra(input[i + 1])) { i++; continue; }
                if (i + 1 < input.length && (input[i + 1] === 'ं' || input[i + 1] === 'ँ' || input[i + 1] === 'ः')) { result += 'a'; i++; continue; }
                if (i + 1 >= input.length || !isDevanagari(input[i + 1]) || isConsonant(input[i + 1]) || isIndependentVowel(input[i + 1])) { result += 'a'; }
            } else {
                result += mapped;
            }
        } else { result += ch; }
        i++;
    }
    return result;
}
function iastToDevanagari(input) {
    let result = '';
    let i = 0;
    const passthrough = ch => ' \n\t.,;:!?-()"\'0123456789'.includes(ch);

    const consumeConsonant = (cons, nextI) => {
        result += iastToDevMap[cons];
        if (nextI >= input.length) { result += '्'; return nextI; }
        if (nextI + 1 < input.length) {
            const two = input.substring(nextI, nextI + 2);
            if (vowels.has(two) && two !== 'a') { result += iastVowelMatra[two]; return nextI + 2; }
        }
        const one = input[nextI];
        if (vowels.has(one) && one !== 'a') { result += iastVowelMatra[one]; return nextI + 1; }
        if (one === 'a') { return nextI + 1; }
        result += '्';
        return nextI;
    };

    while (i < input.length) {
        if (passthrough(input[i])) { result += input[i]; i++; continue; }

        let matched = false;
        if (i + 1 < input.length) {
            const two = input.substring(i, i + 2);
            if (iastToDevMap[two]) {
                if (consonants.has(two)) { i = consumeConsonant(two, i + 2); }
                else { result += iastToDevMap[two]; i += 2; }
                matched = true;
            }
        }
        if (!matched) {
            const one = input[i];
            if (iastToDevMap[one] && consonants.has(one)) { i = consumeConsonant(one, i + 1); matched = true; }
            else if (iastToDevMap[one] && !vowels.has(one)) { result += iastToDevMap[one]; i++; matched = true; }
        }
        if (!matched) {
            if (i + 1 < input.length) {
                const two = input.substring(i, i + 2);
                if (vowels.has(two)) {
                    const lastCh = result[result.length - 1] || '';
                    result += isConsonant(lastCh) ? iastVowelMatra[two] : getStandaloneVowel(two);
                    i += 2; matched = true;
                }
            }
            if (!matched) {
                const one = input[i];
                if (vowels.has(one)) {
                    const lastCh = result[result.length - 1] || '';
                    if (one === 'a') { if (!isConsonant(lastCh)) result += 'अ'; }
                    else { result += isConsonant(lastCh) ? iastVowelMatra[one] : getStandaloneVowel(one); }
                    i++;
                } else { result += one; i++; }
            }
        }
    }
    return result;
}
