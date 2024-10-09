// deno.landに公開されているモジュールをimport
// denoではURLを直に記載してimportできます
import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";

import { bartoVowel, isValid, ktoh } from "./token.js";
import { token } from "./word.js";

// 単語のログ
const hiraganaArray =
    "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわがぎぐげござじづぜぞだぢづでどばびぶべぼぱぴぷぺぽ"
        .split("");
let randomHiragana =
    hiraganaArray[Math.floor(Math.random() * hiraganaArray.length)];
let wordLog = [randomHiragana];

const smallHiragana = ["ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゃ", "ゅ", "ょ", "ゎ", "っ"];

// localhostにDenoのHTTPサーバーを展開
Deno.serve(async (request) => {
    // パス名を取得する
    // http://localhost:8000/hoge に接続した場合"/hoge"が取得できる
    const pathname = new URL(request.url).pathname;
    console.log(`pathname: ${pathname}`);

    // GET /prev-word: 直前の単語を返す
    if (request.method === "GET" && pathname === "/prev-word") {
        return new Response(wordLog.slice(-1)[0]);
    }

    // GET /word-log: 単語ログの配列を返す．
    if (request.method == "GET" && pathname == "/word-log") {
        return new Response(JSON.stringify(wordLog));
    }

    // POST /next-word: 次の単語を入力する
    if (request.method === "POST" && pathname === "/next-word") {
        // リクエストのペイロードを取得
        const requestJson = await request.json();
        // JSONの中からnextWordを取得
        const nextWord = requestJson["nextWord"];
        console.log(nextWord);
        const hiraganaNextWord = bartoVowel(isValid(ktoh(await token(nextWord))));
        const oldWordLog = [...wordLog];
        // nextWordが利用可能な単語か検証する
        if (hiraganaNextWord != -1) {
            // 利用可能であれば、previousWordを更新
            wordLog.push(hiraganaNextWord);
        } // 利用不可能な場合にエラーを返す
        else {
            return new Response(
                JSON.stringify({
                    "errorMessage": "利用不可能な文字が含まれています",
                    "errorCode": "10001",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                },
            );
        }
        // nextWordの末尾が「ん」でないことを検証する
        if (hiraganaNextWord.slice(-1) == "ん") {
            return new Response(
                JSON.stringify({
                    "errorMessage": "末尾が「ん」で終わっています",
                    "errorCode": "10002",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                },
            );
        }
        // 単語が使用済みでないことを確認する
        if (oldWordLog.includes(hiraganaNextWord)) {
            return new Response(
                JSON.stringify({
                    "errorMessage": "同じ単語がすでに使われています",
                    "errorCode": "10003",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                },
            );
        }

        // 頭文字が末尾と前の単語の末尾と同じであることを確認する
        var i = (smallHiragana.includes(oldWordLog[oldWordLog.length-1].slice(-1))) ? 2 : 1;
        console.log("aa"+oldWordLog[oldWordLog.length-1].slice(-i)+"aa");
        console.log(hiraganaNextWord.slice(0,i));
        if (hiraganaNextWord.slice(0,i) != oldWordLog[oldWordLog.length-1].slice(-i)){
            return new Response(
                JSON.stringify({
                    "errorMessage": "単語が正しい文字から始まっていません",
                    "errorCode": "10004",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                },
            );
        }
        var neweord = [nextWord,hiraganaNextWord];
        // 現在のひらがな変換前単語を返す
        return new Response(neweord);
    }

    //時間切れであることをエラーで返す
    if (request.method == "POST" && pathname == "/time-over") {
        return new Response(
            JSON.stringify({
                "errorMessage": "時間ぎれです",
                "errorCode": "10004"
            }),
            {
                staus: 400,
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                }
            }
        )
    }

    if (request.method == "POST" && pathname == "/reset-log") {
        randomHiragana =
            hiraganaArray[Math.floor(Math.random() * hiraganaArray.length)];
        wordLog = [randomHiragana];
        return new Response(wordLog.slice(-1)[0]);
    }

    // ./public以下のファイルを公開
    return serveDir(
        request,
        {
            /*
            - fsRoot: 公開するフォルダを指定
            - urlRoot: フォルダを展開するURLを指定。今回はlocalhost:8000/に直に展開する
            - enableCors: CORSの設定を付加するか
            */
            fsRoot: "./public/",
            urlRoot: "",
            enableCors: true,
        },
    );
});
