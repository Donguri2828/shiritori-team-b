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

let timerInterval;
let minutes;
let seconds;
let logs = [];
const smallHiragana = ["ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゃ", "ゅ", "ょ", "ゎ", "っ"];

function starttime() {
  // カウントダウンを開始する前にタイマーが動いていればクリア
  clearInterval(timerInterval);

  // 初期値を 1:00 に設定
  minutes = 0;
  seconds = 3;
  document.getElementById("time").textContent = "0:03";

  // 1秒ごとにupdateTimeを実行
  timerInterval = setInterval(updateTime, 1000);
}
function updateTime() {
  // 秒を減らす
  if (seconds === 0) {
    if (minutes === 0) {
      clearInterval(timerInterval); // カウントダウン終了
      return;
    }
    minutes--;
    seconds = 59;
  } else {
    seconds--;
  }

  // 分と秒をフォーマット
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  // HTMLのtime要素を更新
  document.getElementById(
    "time"
  ).textContent = `${formattedMinutes}:${formattedSeconds}`;
}
// starttime();

document.querySelector(".restart").onclick = async(event) => {
    const response = await fetch("/reset-log", {method: "POST"});
    const previousWord = await response.text();
    const paragraph = document.querySelector("#first");
    paragraph.innerHTML = previousWord;
    const left = document.querySelector("#left");
    left.innerHTML = "";
}

function log() {
  const dialog = document.getElementById("dialog");
  dialog.showModal();
  modalMain();
}

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

function ok(word) {
  document.getElementById("word").value = "";
  changeLeft(word);
  changeFirst(word2char(word));
  logs.push(word);
  starttime();
}
function changeLeft(word = "") {
  document.getElementById("left").textContent = word;
}
function changeFirst(char = "") {
  document.getElementById("first").textContent = char;
}
function word2char() {}

function modalBtn() {
  const dialog = document.getElementById("dialog");
  dialog.close();
}

function modalMain() {
  const endLogs = document.getElementById("endLogs");
  endLogs.innerHTML = logs.join("<br />↓<br />");
}
// モータル外をクリックして閉じる処理
dialog.addEventListener("click", (e) => {
  const dialog = document.getElementById("dialog");
  const dialogPosition = dialog.getBoundingClientRect();
  if (
    e.clientX < dialogPosition.left ||
    e.clientX > dialogPosition.right ||
    e.clientY < dialogPosition.top ||
    e.clientY > dialogPosition.bottom
  ) {
    dialog.close();
  }
});
