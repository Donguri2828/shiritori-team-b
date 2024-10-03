let timerInterval;
let minutes;
let seconds;
let logs = [];
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

function endlog() {
  const dialog = document.getElementById("dialog");
  dialog.showModal();
  modalMain();
}
function modalBtn() {
  const dialog = document.getElementById("dialog");
  dialog.close();
}

function modalMain() {
  const endLogs = document.getElementById("endLogs");
  const logs = [
    "a",
    "bb",
    "ccc",
    "dddd",
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
  ];
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
