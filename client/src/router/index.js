import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import AddPost from "../components/Posts/AddPost.vue";
import Posts from "../components/Posts/Posts.vue";
import Post from "../components/Posts/Post.vue";

import Profile from "../components/Auth/Profile.vue";
import Signin from "../components/Auth/Signin.vue";
import Signup from "../components/Auth/Signup.vue";

import AuthGaurd from '../AuthGaurd'

Vue.use(VueRouter)

const routes = [
{
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/posts",
    name: "Posts",
    component: Posts
  },
   {
    path: "/posts/:postId",
    name: "Post",
    component: Post,
    props: true
  },
  {
    path: "/post/add",
    name: "AddPost",
    component: AddPost,
    beforeEnter: AuthGaurd
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    beforeEnter: AuthGaurd
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
