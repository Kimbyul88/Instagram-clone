<script>
  import {
    getDatabase,
    ref,
    set,
    onValue,
    update,
    child,
    push,
    get,
    remove,
  } from "firebase/database";
  import { detail_postAt } from "../pages/Mypage.svelte";
  import { onMount } from "svelte";
  import { postAT } from "./Detailpage.svelte";
  import Timebar from "../pages/Timebar.svelte";
  const ATAT = detail_postAt;

  let title;
  let writer;
  let detail;
  let prevdetail;
  const db = getDatabase(); //데이터베이스 참조 가져오기
  const postRef = ref(db, "posts/");

  $: posts = [];
  let targetPost;

  function writeUserData() {
    onValue(postRef, (snapshot) => {
      const data = snapshot.val();
      posts = Object.values(data);
    });
    posts.forEach((post) => {
      // console.log(ATAT, post.postAt.toString());
      if (ATAT === `${post.postAt}`) {
        prevdetail = post.detail;
        update(ref(db, "posts/" + `${post.writer}` + `${post.postAt}`), {
          title,
          detail,
        });
      }
    });
    window.location.hash = `#/detailpage/:${ATAT}`;
  }
  const handleSubmit = () => {
    writeUserData();
  };
</script>

<Timebar />

<a href="/#/detailpage/:{ATAT}" class="detail-previous">
  <img src="../dist/assets/arrow-left.svg" alt="" />
</a>
<div class="edit-page">
  <div class="editmsg">수정하기</div>
  <form id="write-form" on:submit|preventDefault={handleSubmit}>
    <div>
      <label for="editedTitle">제목</label>
      <input bind:value={title} id="editedTitle" />
    </div>
    <div>
      <label for="editedDetail">설명</label>
      <textarea bind:value={detail} id="editedDetail"></textarea>
    </div>
    <div class="submit-btn">
      <button type="submit">완료</button>
    </div>
  </form>
</div>

<style>
  .edit-page {
    font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo",
      "Pretendard Variable", Pretendard, Roboto, "Noto Sans KR", "Segoe UI",
      "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      sans-serif;
    /* display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; */
  }
  .editmsg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    padding: 10px 0 10px 0;
    background-color: rgb(255, 192, 169);
    /* border-bottom: 2px solid rgb(157, 149, 146); */
    font-size: 20px;
    margin-right: 10px;
  }
  .detail-previous {
    transform: translate(-25vw, 0);
  }
  .detail-previous img {
    transform: translate(0, 40px);
    width: 30px;
    height: 30px;
  }
  form {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
  }
  input {
    display: flex;
    align-items: start;
    justify-content: center;
    margin: 10px 0 10px 0;
    width: 60vw;
    height: 30px;
  }
  textarea {
    width: 60vw;
    height: 60px;
    display: flex;
    align-items: start;
    justify-content: center;
    margin: 10px 0 10px 0;
  }
</style>
