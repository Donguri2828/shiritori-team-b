const hiraregex = /^[\u3041-\u3094\u30FC]+$/;
const kataregex = /[\u30A1-\u30F6]/g;
const notRegex = /[\u3090\u3091]/; // not正規表現

export function isValid(input) {
    if(hiraregex.test(input) && !notRegex.test(input)){
        return input;
    }else{
        return -1;
    };
}

export function ktoh(input) {
    return input.replace(kataregex, (match) => {
        return String.fromCharCode(match.charCodeAt(0) - 0x60);
    });
}

export function bartoVowel(input) {
    const vowelMap = {
        'あ': 'あ', 'い': 'い', 'う': 'う', 'え': 'え', 'お': 'お',
        'か': 'あ', 'き': 'い', 'く': 'う', 'け': 'え', 'こ': 'お',
        'さ': 'あ', 'し': 'い', 'す': 'う', 'せ': 'え', 'そ': 'お',
        'た': 'あ', 'ち': 'い', 'つ': 'う', 'て': 'え', 'と': 'お',
        'な': 'あ', 'に': 'い', 'ぬ': 'う', 'ね': 'え', 'の': 'お',
        'は': 'あ', 'ひ': 'い', 'ふ': 'う', 'へ': 'え', 'ほ': 'お',
        'ま': 'あ', 'み': 'い', 'む': 'う', 'め': 'え', 'も': 'お',
        'や': 'あ', 'ゆ': 'う', 'よ': 'お',
        'ら': 'あ', 'り': 'い', 'る': 'う', 'れ': 'え', 'ろ': 'お',
        'わ': 'あ',
        'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お',
        'ゃ': 'あ', 'ゅ': 'う', 'ょ': 'お',
        'ゎ': 'あ', 'ゔ': "う",
        'が': 'あ', 'ぎ': 'い', 'ぐ': 'う', 'げ': 'え', 'ご': 'お',
        'ざ': 'あ', 'じ': 'い', 'ず': 'う', 'ぜ': 'え', 'ぞ': 'お',
        'だ': 'あ', 'ぢ': 'い', 'づ': 'う', 'で': 'え', 'ど': 'お',
        'ば': 'あ', 'び': 'い', 'ぶ': 'う', 'べ': 'え', 'ぼ': 'お',
        'ぱ': 'あ', 'ぴ': 'い', 'ぷ': 'う', 'ぺ': 'え', 'ぽ': 'お',
    };

    let result = '';
    
    for (let i = 0; i < input.length; i++) {
        const currentChar = input[i];
        if (currentChar === 'ー') {
            const prevChar = input[i - 1];
            if (vowelMap[prevChar]) {
                result += vowelMap[prevChar];
            }
        } else {
            result += currentChar;
        }
    }
    return result;
}

const text1 = "こんにちはアイウー";
const text2 = "こんにちはアヱウー";

console.log(bartoVowel(isValid(ktoh(text1)))); // "こんにちはあいうう"
console.log(bartoVowel(isValid(ktoh(text2)))); // -1


const kuromoji = require('kuromoji');
kuromoji.builder({ dicPath: 'public/dict/' }).build((err, tokenizer) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const text = "すもももももももものうち";
    const tokens = tokenizer.tokenize(text);
    console.log(tokens);
});