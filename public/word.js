const kuromoji = require('kuromoji');
kuromoji.builder({ dicPath: 'public/dict/' }).build((err, tokenizer) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const text = "び";
    const tokens = tokenizer.tokenize(text);
    console.log(tokens);
    if(tokens.length > 1){
        return "文章";
    }
    if(tokens[0].pos != "名詞"){
        return "名詞以外";
    }
    if(tokens[0].word_type == "UNKNOWN"){
        return "未登録の単語";
    }
    if(typeof tokens[0].reading === "undefined"){
        return text;
    }else{
        return tokens[0].reading;
    }
});