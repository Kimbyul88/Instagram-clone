<script>
  import {
    getDatabase,
    ref,
    update,
    push,
    set,
    remove,
  } from "firebase/database";
  import {
    getStorage,
    ref as refImage,
    uploadBytes,
    getDownloadURL,
  } from "firebase/storage";
  import Timebar from "./Timebar.svelte";

  let files;
  let user_id;
  let user_password;
  let user_name;
  let user_desc;

  const db = getDatabase();
  //**************************************************************
  const storage = getStorage();
  //   const storageRef = refImage(storage, "stars.jpg");

  const uploadFile = async () => {
    const file = files[0];
    const name = file.name;
    const imgRef = refImage(storage, "user_profile" + "/" + user_id);
    const res = await uploadBytes(imgRef, file);
    const url = await getDownloadURL(imgRef);
    return url;
  };
  //**************************************************************
  function writeUserData(imgUrl) {
    update(ref(db, "users/" + user_id), {
      user_id,
      user_password,
      user_name,
      user_desc,
      imgUrl,
    });
    window.location.hash = "#/mypage";
  }

  const handleSubmit = async () => {
    const url = await uploadFile();
    writeUserData(url);
  };
</script>

<header>
  <Timebar />
</header>
<main>
  <form on:submit|preventDefault={handleSubmit}>
    <div>
      <label for="profile_image">프로필 이미지</label>
      <input type="file" id="profile_image" name="profile_image" bind:files />
    </div>
    <div>
      <label for="user_id">아이디</label>
      <input
        required
        type="text"
        id="user_id"
        name="user_id"
        placeholder="아이디"
        bind:value={user_id}
      />
    </div>
    <div>
      <label for="user_password">비밀번호</label>
      <input
        required
        type="text"
        id="user_password"
        name="user_password"
        placeholder="비밀번호"
        bind:value={user_password}
      />
    </div>
    <div>
      <label for="user_name">이름</label>
      <input
        required
        type="text"
        id="user_name"
        name="user_name"
        placeholder="이름"
        bind:value={user_name}
      />
    </div>
    <div>
      <label for="user_desc">소개</label>
      <input
        required
        type="text"
        id="user_desc"
        name="user_desc"
        placeholder="소개"
        bind:value={user_desc}
      />
    </div>
    <div class="submit-btn"><button type="submit">완료</button></div>
  </form>
</main>

<style>
  main {
    color: black;
    margin-top: 40px;
  }
</style>
