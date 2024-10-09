import { kuromoji } from "./public/src/kuromoji.js";

export function token(text){
    return new Promise((resolve, reject) => {
        kuromoji.builder({ dicPath: './public/dict/' }).build((err, tokenizer) => {
            if (err) {
                console.error(err);
                return;
            }
            
            const tokens = tokenizer.tokenize(text);
            console.log(tokens);
            if(tokens.length > 1){
                return resolve(-2);//1単語でない
            }
            if(tokens[0].pos != "名詞"){
                return resolve(-1);//名詞でない
            }
            if(tokens[0].word_type == "UNKNOWN"){
                return resolve(-1);//辞書にない単語
            }
            if(typeof tokens[0].reading === "undefined"){
                console.log("b");
                return resolve(text);
            }else{
                console.log("a");
                console.log(tokens[0].reading);
                return resolve(tokens[0].reading);
            }
        });
    });
}