import { join } from "https://deno.land/std@0.223.0/path/join.ts";

window.onload = async (event) => {
  const response = await fetch("/prev-word", {method: "GET"});
  const prevWord = await response.text();
  const first = document.getElementById("first");
  first.innerHTML = prevWord
}
const smallHiragana = ["ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゃ", "ゅ", "ょ", "ゎ", "っ"];
let timerInterval;
let minutes;
let seconds;


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
starttime();


document.getElementById('go').onclick = async (event) => {
  const first = document.getElementById("first");
  const input = document.getElementById("word");
  const nextWordText = first.value + input.value;
  const response = await fetch(
    "/next-word",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({nextWord: nextWordText})
    }
  );

  // status: 200以外が返ってきた場合にエラーを表示
  if (response.status !== 200) {
    const errorJson = await response.text();
    const errorObj = JSON.parse(errorJson);
    alert(errorObj["errorMessage"]);
    return;
  }

  const hiraganaPrevWord = await response.text();

  const prevWord = document.getElementById("left");
  prevWord.innerHTML = nextWordText
  let firstLength
  if (smallHiragana.includes(hiraganaPrevWord.slice(-1)[0])) {
    firstLength = 2;
  }
  else {
    firstLength = 1;
  }
  first.innerHTML = hiraganaPrevWord.slice(-firstLength)
  input.value = "";

}

function restart() {
  logs = [];
  document.getElementById("left").textContent = "";
  document.getElementById("first").textContent = "りょ";
  document.getElementById("word").value = "";
  starttime();
}
function log() {
  console.log(logs);
}
function go() {
  const text1 =
    document.getElementById("first").textContent +
    document.getElementById("word").value;
  console.log(text1);
  ok(text1);
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
