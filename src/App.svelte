<script>
  import Homepage from "./pages/Homepage.svelte";
  import Mypage from "./pages/Mypage.svelte";
  import Write from "./pages/Write.svelte";
  import NotFound from "./pages/Notfound.svelte";
  import Router from "svelte-spa-router";
  import Detailpage from "./routes/Detailpage.svelte";
  import Signup from "./pages/Signup.svelte";
  import { wrap } from "svelte-spa-router/wrap";
  import "./css/style.css";
  import Editpage from "./routes/Editpage.svelte";
  import ProfileEdit from "./routes/ProfileEdit.svelte";

  let title;

  const routes = {
    "/": Mypage,
    "/signup": Signup,
    "/mypage": Mypage,
    "/write": Write,
    "/profileedit": ProfileEdit,
    "/editpage/:postAt": wrap({
      asyncComponent: () => import("./routes/Editpage.svelte"),
      // // Static props
    }),
    "/detailpage/:postAt": wrap({
      asyncComponent: () => import("./routes/Detailpage.svelte"),
      // // Static props
    }),
    "*": NotFound,
  };
</script>

<Router {routes} />

<!-- <div id="app"></div> -->

<style>
  @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css");
</style>
