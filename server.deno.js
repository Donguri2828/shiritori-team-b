// deno.landに公開されているモジュールをimport
// denoではURLを直に記載してimportできます
import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";

// 単語のログ
const hiraganaArray = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわがぎぐげござじづぜぞだぢづでどばびぶべぼぱぴぷぺぽ".split('')
let randomHiragana = hiraganaArray[Math.floor(Math.random() * hiraganaArray.length)];
const wordLog = [randomHiragana];

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
  if(request.method == "GET" && pathname == "/word-log"){
    return new Response(JSON.stringify(wordLog))
  }

  // POST /next-word: 次の単語を入力する
  if (request.method === "POST" && pathname === "/next-word") {
    // リクエストのペイロードを取得
    const requestJson = await request.json();
    // JSONの中からnextWordを取得
    const nextWord = requestJson["nextWord"];

    // nextWordが利用可能な単語か検証する
    if (/*TODO ここに辞書参照処理を記述*/ true) {
            // 同一であれば、previousWordを更新
            wordLog.push(nextWord);
        }
        // 利用不可能な場合にエラーを返す
        else {
            return new Response(
                JSON.stringify({
                    "errorMessage": "辞書に存在しない名詞です",
                    "errorCode": "10001"
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                }
            );
        }

        // 現在の単語を返す
        return new Response(wordLog.slice(-1)[0]);
    }

  if(request.method == "DELETE" && pathname == "/reset-log") {
    wordLog.length = 0; // 配列の中身を全削除しています
    randomHiragana = hiraganaArray[Math.floor(Math.random() * hiraganaArray.length)];
    wordLog.push(randomHiragana)
    return new Response()
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
        }
    )
});
