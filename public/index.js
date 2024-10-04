window.onload = async (event) => {
    // GET /shiritoriを実行
    const response = await fetch("/prev-word", { method: "GET" });
    // responseの中からレスポンスのテキストデータを取得
    const previousWord = await response.text();
    // id: previousWordのタグを取得
    const paragraph = document.querySelector("#first");
    // 取得したタグの中身を書き換える
    paragraph.innerHTML = `${previousWord}`;
  }

const smallHiragana = ["ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゃ", "ゅ", "ょ", "ゎ", "っ"];

// 送信ボタンの押下時に実行
document.querySelector("#go").onclick = async(event) => {
    // wordタグを取得
    const nextWordInput = document.querySelector("#word");
    // firstタグを取得
    const firstWord = document.querySelector("#first");
    // firstとwordの中身を取得
    const nextWordInputText = firstWord.innerHTML + nextWordInput.value;
    // POST /shiritoriを実行
    // 次の単語をresponseに格納
    const response = await fetch(
      "/next-word",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nextWord: nextWordInputText })
      }
    );

    // status: 200以外が返ってきた場合にエラーを表示
    if (response.status !== 200) {
      const errorJson = await response.text();
      const errorObj = JSON.parse(errorJson);
      alert(errorObj["errorMessage"]);
      return;
    }

    const previousWord = await response.text();

    // id: previousWordのタグを取得
    const paragraph = document.querySelector("#left");
    // 取得したタグの中身を書き換える
    paragraph.innerHTML = `${previousWord}`;

    // firstタグの中身を書き換える
    if (smallHiragana.includes(previousWord.slice(-1))) {
        firstWord.innerHTML = previousWord.slice(-2);
    }
    else {
        firstWord.innerHTML = previousWord.slice(-1);
    }

    // inputタグの中身を消去する
    nextWordInput.value = "";
  }

document.querySelector("#restart").onclick = async(event) => {
    const response = await fetch("/reset-log", {method: "POST"});
    const previousWord = await response.text();
    const paragraph = document.querySelector("#first");
    paragraph.innerHTML = previousWord;
}