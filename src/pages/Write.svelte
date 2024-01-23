<script>
  import {
    getDatabase,
    ref,
    update,
    push,
    set,
    remove,
    onValue,
  } from "firebase/database";
  import {
    getStorage,
    ref as refImage,
    uploadBytes,
    getDownloadURL,
  } from "firebase/storage";
  import Timebar from "./Timebar.svelte";
  import { onMount } from "svelte";

  $: users = [];

  let title;
  let writer;
  // let postAt = `${today.getFullYear()}년 ${today.getMonth()}월 ${today.getDay()}일`;
  let postAt = new Date().getTime();
  let detail;
  let files;
  const db = getDatabase();
  //**************************************************************
  const storage = getStorage();
  let userRef = ref(db, "users/");

  const uploadFile = async () => {
    const file = files[0];
    const name = file.name;
    const imgRef = refImage(storage, name);
    const res = await uploadBytes(imgRef, file);
    const url = await getDownloadURL(imgRef);
    return url;
  };
  //**************************************************************
  function writeUserData(imgUrl) {
    update(ref(db, "posts/" + `${writer}/` + postAt), {
      title,
      writer,
      postAt,
      detail,
      imgUrl,
    });
    window.location.hash = "#/mypage";
  }

  const handleSubmit = async () => {
    const url = await uploadFile();
    writeUserData(url);
  };
  onMount(() => {
    onValue(userRef, (snapshot) => {
      const data_user = snapshot.val();
      if (data_user !== null) {
        users = Object.values(data_user);
      }
    });
  });
</script>

<Timebar />

<div>
  <a href="/#/mypage" class="detail-previous">
    <img src="../dist/assets/arrow-left.svg" alt="" />
  </a>
</div>
<div class="write-header" id="write-header">
  <div class="write-header__center">글쓰기</div>
</div>
<!--write-header-->
<form id="write-form" on:submit|preventDefault={handleSubmit}>
  <div>
    <label for="image">이미지</label>
    <input type="file" id="image" name="image" bind:files />
  </div>
  <div>
    <label for="title">제목</label>
    <input
      type="text"
      id="title"
      name="title"
      placeholder="제목을 입력해주세요"
      bind:value={title}
    />
  </div>
  <!-- <div>
    <label for="writer">작성자</label>
    <input
      type="text"
      id="writer"
      name="writer"
      placeholder="작성자 이름(아이디)을 입력해주세요"
      bind:value={writer}
    />
  </div> -->
  <label for="writer">작성자</label>
  <select name="writer" id="writer" bind:value={writer}>
    <option value=" ">선택해주세요</option>
    {#each users as user}
      <option value={user.user_id}>{user.user_id}</option>
    {/each}
  </select>
  <div>
    <label for="detail">설명</label>
    <textarea
      id="detail"
      name="detail"
      placeholder="글의 내용을 입력해 주세요"
      bind:value={detail}
    />
  </div>
  <div class="submit-btn"><button type="submit">완료</button></div>
</form>

<style>
  a img {
    transform: translate(10px, 40px);
    width: 30px;
  }
  .write-header {
    margin-top: 0px;
    margin-left: 10px;
    margin-bottom: 10px;
    padding: 10px 0 10px 0;
    background-color: rgb(241, 241, 241);
    /* border-bottom: 2px solid rgb(157, 149, 146); */
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  form {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
  }
  input {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0 10px 0;
    width: 60vw;
    height: 30px;
    background-color: none;
  }
  textarea {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60vw;
    height: 100px;
    margin: 10px 0 10px 0;
  }
  div {
    font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo",
      "Pretendard Variable", Pretendard, Roboto, "Noto Sans KR", "Segoe UI",
      "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      sans-serif;
  }
</style>
