<template>

  <b-container style="width: 80%;">

    <b-row class="justify-content-md-center">
      <div v-if="loading" class="">
        <b-spinner label="Loading..." style="width: 9rem; height: 9rem; margin-top: 50%"></b-spinner>
      </div>

        <div class="justify-content-md-center" v-if="!loading && posts.length === 0" style="margin-top: 100px; text-align: center;">
          <h1>Welcome to VueShare</h1>
          <h3>Please Create an acount to begin sharing your favorite photos.</h3>
        </div>

        <b-carousel id="carousel-1" v-if="!loading && posts.length > 0" v-model="slide" :interval="4000" controls indicators background="#ababab"
          img-width="600" img-height="600" style="text-shadow: 1px 1px 2px #333;" @sliding-start="onSlideStart" @sliding-end="onSlideEnd">
          <!-- Slide Item  -->
          <b-carousel-slide @click.native="goToPost(post._id)" v-for="post in posts" :key="post._id" :caption="post.title" :text="post.description"
            :img-src="post.imageUrl" style="cursor: pointer;"></b-carousel-slide>
        </b-carousel>
      </b-row>
  </b-container>

</template>

<script>
  import { gql } from 'apollo-boost';
  import { mapGetters } from 'vuex';

  export default {
    name: 'home',
    created() {
      this.handleGetCarouselPosts();
    },
    computed: {
      ...mapGetters(['loading', 'posts'])
    },
    data() {
      return {
        slide: 0,
        sliding: null
      }
    },
    methods: {
      handleGetCarouselPosts() {
        // Reach out to Vuex store, and fire action that gets posts for the carousel
        this.$store.dispatch("getPosts");
      },
      onSlideStart(slide) {
        this.sliding = true
      },
      onSlideEnd(slide) {
        this.sliding = false
      },
      goToPost(postId) {
        this.$router.push(`/posts/${postId}`)
      }
    }
  }

</script>