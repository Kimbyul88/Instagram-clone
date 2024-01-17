<script context="module">
  const exportpostAt = (postAT) => {
    postAT = postAT;
    return postAT;
  };
  export let postAT;
</script>

<script>
  import {
    getDatabase,
    ref,
    onValue,
    remove,
    update,
    push,
  } from "firebase/database";
  import { detail_postAt } from "../pages/Mypage.svelte";
  import Timebar from "../pages/Timebar.svelte";
  import { getStorage, ref as stref, deleteObject } from "firebase/storage";
  import { onMount } from "svelte";

  exportpostAt(detail_postAt);
  // console.log("Received ID:", title);
  const goEditPage = () => {
    window.location.hash = `#/editpage/:${detail_postAt}`;
  };

  const handleCommentBtn = (event) => {
    const HIDDEN_CLASSNAME = "hidden";
    const btn = document.querySelector(".comment-btn");
    const commentBlock = document.querySelector(".detailpage-comment");
    if (commentBlock.classList.contains(HIDDEN_CLASSNAME)) {
      commentBlock.classList.remove(HIDDEN_CLASSNAME);
    } else {
      commentBlock.classList.add(HIDDEN_CLASSNAME);
    }
  };

  const calcTime = (timestamp) => {
    //한국시간 UTC+9
    const stamp = parseInt(timestamp);
    const curTime = new Date().getTime() - 60 * 60 * 1000;
    const time = new Date(curTime - stamp);
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();
    if (curTime - stamp >= 24 * 60 * 60 * 1000)
      return `${new Date(stamp).getFullYear()}년 ${
        new Date(stamp).getMonth() + 1
      }월 ${new Date(stamp).getDate()}일`;
    else if (hour > 0 && hour < 24) return `${hour}시간 전`;
    else if (minute > 0) return `${minute}분 전`;
    else if (second > 0) return `${second}초 전`;
    else return "방금 전";
  };

  let imgUrl;
  let title;
  let writer;
  let postAt = detail_postAt;
  let detail;
  //
  let nickname;
  let contents;
  //
  const db = getDatabase();
  const postRef = ref(db, "posts/");
  const commentRef = ref(db, "comments/" + postAt);

  $: posts = [];
  $: comments = [];
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
          new Date();
        }
      });
      window.location.hash = `#/mypage`;
    } else {
      window.location.hash = `#/detailpage/:${detail_postAt}`;
    }
  };
  onMount(() => {
    onValue(commentRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        comments = Object.values(data);
        console.log(comments);
      }
    });
  });
  const handleCommentWrite = () => {
    push(ref(db, "comments/" + postAt), {
      nickname,
      contents,
    });
    nickname = "";
    contents = "";
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
  <div class="detail-iconBox">
    <img src="../dist/assets/heart.svg" alt="" />
    <button on:click={handleCommentBtn} id="comment-btn" class="comment-btn">
      <img src="../dist/assets/comment.svg" alt="" />
    </button>
  </div>
  <div class="detailpage-main__textBox">
    <div class="textBox-upBox">
      <div class="detailpage-main__writer">{writer}</div>
      <div class="detailpage-main__title">{title}</div>
    </div>
    <div class="detailpage-main__detail" style="word-break:break-all">
      {detail}
    </div>
    <div class="detailpage-main__postAt">{calcTime(detail_postAt)}</div>
  </div>
</div>
<div class="detailpage-comment hidden">
  <div class="comment-title">
    <img src="../dist/assets/x.svg" alt="x" />
    <div>댓글</div>
  </div>
  <div class="comment-list">
    {#each comments as comment}
      <div class="comment-list-one">
        <div class="comment-list-circle"></div>
        <div class="list-one__text">
          <div class="cmt-nickname">{comment.nickname}</div>
          <div class="cmt-detail">{comment.contents}</div>
        </div>
      </div>
    {/each}
  </div>
  <form>
    <input
      bind:value={nickname}
      id="nickname"
      name="nickname"
      type="text"
      placeholder="닉네임"
    />
    <input
      bind:value={contents}
      id="contents"
      name="contents"
      type="text"
      placeholder="내용"
    />
    <button type="submit" on:click|preventDefault={handleCommentWrite}
      >쓰기</button
    >
  </form>
</div>

<style>
  form {
    display: flex;
    justify-content: center;
    align-items: start;
    position: fixed;
    bottom: 0;
    left: 5vw;
  }
  #nickname {
    width: 15vw;
  }
  #contents {
    width: 40vw;
  }
  input {
    margin-right: 10px;
    width: 30%;
  }
  .list-one__text {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
  }
  .comment-list-circle {
    background-color: rgb(166, 166, 166);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    margin: 0 0 0 10px;
  }
  .cmt-nickname {
    font-size: 12px;
    font-weight: bold;
  }
  .cmt-detail {
    margin-top: 3px;
    font-weight: 300;
    font-size: 16px;
  }
  .comment-list-one {
    height: 40px;
    width: 100%;
    padding: 5px 0 5px 0;
    margin: 7px 10px 5px 10px;
    display: flex;
    /* flex-direction: column; */
    justify-content: start;
    align-items: center;
    border-bottom: 1px dotted gray;
  }
  .comment-list {
    width: 90%;
    height: 85%;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    /* border: 2px solid purple; */
    margin-top: 2px;
  }
  #comment-btn {
    border: none;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .detailpage-comment {
    font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo",
      "Pretendard Variable", Pretendard, Roboto, "Noto Sans KR", "Segoe UI",
      "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      sans-serif;
    display: block;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    margin-top: 10px;
    border: 1px solid gray;
    width: 80vw;
    height: 50vh;
    padding-bottom: 7px;
    transform: translate(7vw, 0);
    /* transition: trnasform 5s ease-in-out; */
  }
  .comment-title {
    width: 100%;
  }
  .comment-title img {
    transform: translate(5px, 0);
    width: 25px;
    /* display: none; */
    opacity: 0;
  }
  .comment-title div {
    transform: translate(-37vw, 0);
  }
  .comment-title {
    padding-bottom: 6px;
    border-bottom: 1px solid gray;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    font-weight: 600;
    font-size: 15px;
  }
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
  .detail-iconBox img {
    width: 30px;
    margin-right: 5px;
  }
  .detail-iconBox {
    display: flex;
    align-items: center;
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
  .hidden {
    display: none;
  }
</style>
