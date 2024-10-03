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

function go() {
  let text1 =
    document.getElementById("first").textContent +
    document.getElementById("word").value;
  console.log(text1);
}
