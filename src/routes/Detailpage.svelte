<script context="module">
  const exportpostAt = (postAT) => {
    postAT = postAT;
    return postAT;
  };
  export let postAT;
</script>

<script>
  import { getDatabase, ref, onValue, remove } from "firebase/database";
  import { detail_postAt } from "../pages/Mypage.svelte";
  import Timebar from "../pages/Timebar.svelte";
  import { getStorage, ref as stref, deleteObject } from "firebase/storage";

  exportpostAt(detail_postAt);
  // console.log("Received ID:", title);
  const goEditPage = () => {
    window.location.hash = `#/editpage/:${detail_postAt}`;
  };

  const calcTime = (timestamp) => {
    //한국시간 UTC+9
    const curTime = new Date().getTime() - 9 * 60 * 60 * 1000;
    const time = new Date(curTime - timestamp);
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();

    if (hour > 0 && hour < 24) return `${hour}시간 전`;
    else if (hour >= 24)
      return `${time.getFullYear()}년 ${time.getMonth()}월 ${time.getDay()}일`;
    else if (minute > 0) return `${minute}분 전`;
    else if (second > 0) return `${second}초 전`;
    else return "방금 전";
  };
  let imgUrl;
  let title;
  let writer;
  let postAt = detail_postAt;
  let detail;
  const db = getDatabase();
  const postRef = ref(db, "posts/");
  // console.log("title:", title);

  $: posts = [];
  let targetPost;

  onValue(postRef, (snapshot) => {
    const data = snapshot.val();
    posts = Object.values(data);
    posts.forEach((post) => {
      if (postAt === `${post.postAt}`) {
        imgUrl = post.imgUrl;
        writer = post.writer;
        detail = post.detail;
        title = post.title;
      }
    });
  });

  const handleRemove = () => {
    if (confirm("이 게시물을 삭제하시겠습니까?")) {
      onValue(postRef, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          posts = Object.values(data);
        }
      });
      posts.forEach((post) => {
        if (postAt === `${post.postAt}`) {
          remove(ref(db, "posts/" + `${post.writer}` + `${post.postAt}`));
        }
      });
      window.location.hash = `#/mypage`;
    } else {
      window.location.hash = `#/detailpage/:${detail_postAt}`;
    }
  };
</script>

<Timebar />
<div class="detailpage-main">
  <div class="detail-infobar">
    <a href="/#/mypage" class="detail-previous">
      <img src="../dist/assets/arrow-left.svg" alt="" />
    </a>
    <div class="infobar-text">
      <div class="infobar-text__1">{writer}</div>
      <div class="infobar-text__2">게시물</div>
    </div>
    <div class="infobar-buttons">
      <button on:click={goEditPage} class="infobar-edit">수정</button>
      <button on:click={handleRemove} class="infobar-delete">삭제</button>
    </div>
  </div>
  <div class="detailpage-main__img">
    <img src={imgUrl} alt="이미지" />
  </div>
  <div class="detail-heart">
    <img src="../dist/assets/heart.svg" alt="" />
  </div>
  <div class="detailpage-main__textBox">
    <div class="textBox-upBox">
      <div class="detailpage-main__writer">{writer}</div>
      <div class="detailpage-main__title">{title}</div>
    </div>
    <div class="detailpage-main__detail" style="word-break:break-all">
      {detail}
    </div>
    <div class="detailpage-main__postAt">{calcTime(postAt)}</div>
  </div>
</div>

<style>
  .infobar-edit {
    border: none;
    padding: 5px 10px 5px 10px;
    width: 60px;
    background-color: rgb(181, 181, 181);
    font-weight: bold;
    border-radius: 5px;
    color: white;
    cursor: pointer;
  }
  .infobar-edit:hover {
    background-color: orange;
  }
  .infobar-delete {
    border: none;
    padding: 5px 10px 5px 10px;
    width: 60px;
    background-color: rgb(181, 181, 181);
    font-weight: bold;
    border-radius: 5px;
    color: white;
    cursor: pointer;
  }
  .infobar-delete:hover {
    background-color: orangered;
  }
  .detailpage-main {
    font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo",
      "Pretendard Variable", Pretendard, Roboto, "Noto Sans KR", "Segoe UI",
      "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      sans-serif;
    margin-left: 0px;
    margin-top: 30px;
  }
  .detail-infobar {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid gray;
    margin-bottom: 10px;
    padding-bottom: 5px;
  }
  .infobar-buttons {
    transform: translate(20vw, 0);
  }
  .infobar-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transform: translate(8vw, 0);
  }
  .infobar-text__1 {
    font-size: 14px;
    color: gray;
  }
  .infobar-text__2 {
    font-weight: bold;
  }
  .detail-previous {
    transform: translate(-17vw, 0);
  }
  .detail-previous img {
    width: 30px;
    height: 30px;
  }
  .detailpage-main__img {
    transform: translate(25%, 0);
  }
  .detailpage-main__img img {
    width: 50vw;
    height: auto;
  }
  .detail-heart img {
    width: 30px;
    margin-right: 5px;
  }
  .detail-heart {
    color: white;
    font-style: italic;
    display: flex;
    align-items: center;
    /* justify-content: center; */
    font-size: 13px;
    width: 60px;
    height: 30px;
  }
  .detailpage-main__textBox {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
  }
  .textBox-upBox {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .detailpage-main__writer {
    font-weight: bold;
    margin-right: 10px;
    font-size: 15px;
  }
  .detailpage-main__title {
    font-weight: 400;
    font-size: 16px;
  }
  .detailpage-main__detail {
    font-weight: 300;
    font-size: 15px;
  }
  .detailpage-main__postAt {
    color: silver;
    font-size: 13px;
    font-weight: 300;
    margin-top: 5px;
  }
</style>
