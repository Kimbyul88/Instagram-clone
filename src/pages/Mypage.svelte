<script context="module">
  function handleDetailPage(event) {
    const clickedImg = document.querySelector(".gallery-post__img");
    detail_postAt = event.target.alt;
    window.location.hash = `#/detailpage/:${detail_postAt}`;

    return detail_postAt;
  }
  export let detail_postAt;
</script>

<script>
  import { onMount } from "svelte";
  import Timebar from "./Timebar.svelte";
  import { getDatabase, ref, onValue } from "firebase/database";

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

  $: posts = [];

  const db = getDatabase();
  const postRef = ref(db, "posts/");

  onMount(() => {
    onValue(postRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        posts = Object.values(data);
      }
    });
  });

  const handleReload = () => {
    // window.location.reload();
    const btn = document.querySelector(".reloading-btn");
    btn.innerHTML = null;
  };
</script>

<Timebar />

<div class="bodybody">
  <header class="mypage-header">
    <div class="id-bar">
      <div class="id-bar__idBox">
        <div class="idBox-id">super_coding24</div>
        <div class="idBox-icons">
          <img src="assets/arrow.svg" alt="" />
          <div class="idBox-icons__redCircle"></div>
        </div>
      </div>
      <div class="id-bar__iconBox">
        글쓰기->
        <a href="#/write" class="write-btn">
          <img src="assets/plus.svg" alt="write" />
        </a>
        <img src="assets/bars.svg" alt="more" />
      </div>
    </div>
    <div class="profile-bar">
      <div class="profile-bar__profile">
        <div class="profile-image">
          <img src="../dist/bear.jpg" alt="profile" />
        </div>
      </div>
      <div class="profile-plusbutton">+</div>

      <div class="profile-bar__follow">
        <div class="follow-post">
          <div class="follow-post__num">0</div>
          <div class="follow-post__desc">게시물</div>
        </div>
        <div class="follow-follow">
          <div class="follow-follow__num">20</div>
          <div class="follow-follow__desc">팔로워</div>
        </div>
        <div class="follow-follow">
          <div class="follow-follow__num">24</div>
          <div class="follow-follow__desc">팔로잉</div>
        </div>
      </div>
    </div>
    <div class="name-bar">
      <div class="name-bar__name">슈퍼코딩 Super Coding</div>
      <div class="name-bar__desc">파이널 프로젝트 🚀</div>
    </div>
    <div class="edit-bar">
      <div class="edit-bar__profile-edit">프로필 편집</div>
      <div class="edit-bar__profile-share">프로필 공유</div>
      <div class="edit-bar__recommend">+</div>
    </div>
  </header>
  <main class="mypage-main">
    <div class="section">
      <div class="section-gallery">
        <img src="../dist/assets/gallery.svg" alt="gallery" />
      </div>
      <div class="section-video">
        <img src="../dist/assets/film.svg" alt="film" />
      </div>
      <div class="section-tagme">
        <img src="assets/tagme.svg" alt="tagme" />
      </div>
    </div>

    <div class="gallery">
      {#each posts as post}
        <div class="gallery-post">
          <button class="gallery-post__img" on:click={handleDetailPage}>
            <img src={post.imgUrl} alt={post.postAt} />
          </button>
          <div class="gallery-post__textBox">
            <div class="gallery-post__writer">{"@" + post.writer}</div>
            <div class="gallery-post__title">{post.title}</div>
            <div class="gallery-post__postAt">{calcTime(post.postAt)}</div>
            <!-- <div class="gallery-post__detail">{post.detail}</div> -->
          </div>
        </div>
      {/each}
    </div>
    <!-- <button class="reloading-btn" on:click|preventDefault={handleReload}
    >새로운 글이 등록되었습니다.</button
  > -->
  </main>
</div>
<footer></footer>
<div class="media-info-msg">화면 사이즈를 줄여주세요</div>

<style>
  .media-info-msg {
    font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo",
      "Pretendard Variable", Pretendard, Roboto, "Noto Sans KR", "Segoe UI",
      "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      sans-serif;
    background-color: rgb(255, 191, 168);
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 80px;
    /* padding-top: 20vh; */
  }

  @media screen and (max-width: 600px) {
    .media-info-msg {
      display: none;
    }
  }
  .bodybody {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /* .reloading-btn:hover {
    background-color: red;
  } */
  button {
    border: none;
    background: none;
    padding: 0 0 0 0;
    cursor: pointer;
  }
  .gallery {
    position: relative;
    transform: translate(0, 40px);
    max-width: 100vw;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(30vw, 1fr));
    grid-row-gap: 2px;
    grid-column-gap: 2px;
    margin: 10px 10px 0 10px;
  }
  .gallery-post__img :hover {
    opacity: 0.7;
  }
  .gallery-post__img {
    width: 30vw;
    height: 30vw;
    border-radius: 3px;
    margin: 0.5px;
    overflow: hidden;
  }
  .gallery-post__img img {
    width: 30vw;
  }
  /* .reloading-btn {
    position: absolute;
    top: 220px;
    left: 32vw;
    background-color: #0194f6;
    color: white;
    padding: 5px 10px 5px 10px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 800;
  } */
</style>
