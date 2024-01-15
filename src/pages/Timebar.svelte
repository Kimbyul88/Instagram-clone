<script>
  let curTime = new Date();
  let min = curTime.getMinutes();
  let hour = curTime.getHours();
  let sec = curTime.getSeconds();
  let time = curTime.getTime();
  let hourStr;
  let minStr = "";

  setInterval(
    () => (
      (time = time + 1000),
      (min = new Date(time).getMinutes()),
      (hour = new Date(time).getHours()),
      (sec = new Date(time).getSeconds()),
      (minStr = String(min).padStart(2, "0"))
    ),
    1000
  );
</script>

<div class="time-bar">
  <div class="time-bar__time">{hour}:{minStr}</div>
  <div class="time-bar__iconBox">
    <img src="assets/chart-bar.svg" alt="" />
    <img src="assets/wifi.svg" alt="" />
    <img src="assets/battery.svg" alt="" />
  </div>
</div>

<style>
  /*맨 위 시간과 배터리*/
  .time-bar {
    font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo",
      "Pretendard Variable", Pretendard, Roboto, "Noto Sans KR", "Segoe UI",
      "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      sans-serif;
    position: fixed;
    top: 10px;
    left: 0px;
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 20px;
  }
  .time-bar__time {
    font-size: 12px;
    margin-left: 15px;
    font-weight: bold;
  }
  .time-bar__iconBox {
    margin-right: 15px;
    position: fixed;
    right: 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .time-bar__iconBox img {
    width: 14px;
    margin-left: 5px;
  }
</style>
