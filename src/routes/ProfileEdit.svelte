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
  import Timebar from "../pages/Timebar.svelte";

  let files;
  let userid;
  let name;
  let desc;
  let imgUrl;

  const db = getDatabase();
  const storage = getStorage();
  const storageRef = refImage(storage, "/profile-imgs");

  const uploadFile = async () => {
    const file = files[0];
    const name = file.name;
    const imgRef = refImage(storage, name);
    const res = await uploadBytes(imgRef, file);
    const url = await getDownloadURL(imgRef);
    return url;
  };

  function writeUserData(imgUrl) {
    push(ref(db, "users/"), {
      name,
      desc,
      imgUrl,
    });
  }

  const handleSubmit = async () => {
    remove(ref(db, "users/"));
    const url = await uploadFile();
    writeUserData(url);
    window.location.hash = "#/mypage";
  };
</script>

<form id="write-form" on:submit|preventDefault={handleSubmit}>
  <div>
    <label for="image">이미지</label>
    <input type="file" id="image" name="image" bind:files />
  </div>
  <div>
    <label for="name">이름</label>
    <input
      type="text"
      id="name"
      name="name"
      placeholder="이름"
      bind:value={name}
    />
  </div>
  <div>
    <label for="desc">소개</label>
    <input
      type="text"
      id="desc"
      name="desc"
      placeholder="소개"
      bind:value={desc}
    />
  </div>
  <div class="submit-btn"><button type="submit">완료</button></div>
</form>
