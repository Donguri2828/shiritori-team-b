import { kuromoji } from "./public/src/kuromoji.js";

export function token(text){
    kuromoji.builder({ dicPath: './public/dict/' }).build((err, tokenizer) => {
        if (err) {
            console.error(err);
            return;
        }
        
        const tokens = tokenizer.tokenize(text);
        console.log(tokens);
        if(tokens.length > 1){
            return -2;//1単語でない
        }
        if(tokens[0].pos != "名詞"){
            return -1;//名詞でない
        }
        if(tokens[0].word_type == "UNKNOWN"){
            return -1;//辞書にない単語
        }
        if(typeof tokens[0].reading === "undefined"){
            return text;
        }else{
            return tokens[0].reading;
        }
    });
}