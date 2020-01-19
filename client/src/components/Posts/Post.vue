<template>
    <b-container v-if="getPost">
        <div class="card text-center">
            <div class="card-header" style="background-color: white">
                <span style="font-weight: bold; font-size: 22px; float: left;">{{getPost.title}} 
                     <b-badge v-if="user" @click="handleToggleLike(getPost._id)" style="cursor: pointer;"><i class="fas fa-thumbs-up"></i></b-badge> <small>{{getPost.likes}} Likes</small> 
                </span>
                <a @click="goToPreviousPage" class="btn" style="float: right; background-color: lightgrey; color: white;"><span>Back</span></a>
            </div>
            <div class="card-body">
                <b-img :src="getPost.imageUrl" fluid style="height: 50vh" alt="user post image"></b-img>
            </div>
            <div class="card-footer text-muted" style="background-color: white;">
                <div style="float: left;">
                    Categories: <span v-for="(category, index) in getPost.categories" :key="index">
                       <b-badge style="margin-left: 5px;">{{category}}</b-badge>
                    </span>
                </div>
                <span style="font-weight: bold; font-size: 18px; margin-left: -15%">{{getPost.description}}</span>
            </div>
        </div>
    </b-container>
</template>

<script>
    import { GET_POST, LIKE_POST, UNLIKE_POST } from '../../queries';
    import { mapGetters } from 'vuex';

    export default {
        name: "Post",
        props: ["postId"],
        data() {
            return {
                postLiked: false
            }
        },
        computed: {
            ...mapGetters(['user', 'userFavorites']),
        },
        apollo: {
            getPost: {
                query: GET_POST,
                variables() {
                    return {
                        postId: this.postId
                    }
                }
            }
        },
        methods: {
            checkIfPostLiked(postId) {
                //check if user favs includes post with if of 'postId'
                if (this.userFavorites && this.userFavorites.some(fave => fave._id === postId)) {
                    this.postLiked = true;
                    return true;                  
                } else {
                    this.postLiked = false
                    return false;
                }
            },
            goToPreviousPage() {
                this.$router.go(-1);
            },
            handleToggleLike(postId) {
                this.checkIfPostLiked(postId)
                if (this.postLiked) {
                    this.handleUnlikePost();
                } else {
                    this.handleLikePost();
                }
            },
            handleLikePost() {
                const variables = {
                    postId: this.postId,
                    username: this.user.username
                }
                this.$apollo.mutate({
                    mutation: LIKE_POST,
                    variables,
                    update: (cache, { data: { likePost } }) => {
                        const data = cache.readQuery({
                            query: GET_POST,
                            variables: { postId: this.postId }
                        });
                        data.getPost.likes += 1;
                        cache.writeQuery({
                            query: GET_POST,
                            variables: { postId: this.postId },
                            data
                        });
                    }
                }).then(({ data }) => {
                    const updatedUser = { ...this.user, favorites: data.likePost.favorites };
                    this.$store.commit('setUser', updatedUser);
                })
                // .catch(err => console.error(err));
            },
            handleUnlikePost() {
                const variables = {
                    postId: this.postId,
                    username: this.user.username
                }
                this.$apollo.mutate({
                    mutation: UNLIKE_POST,
                    variables,
                    update: (cache, { data: { unlikePost } }) => {
                        const data = cache.readQuery({
                            query: GET_POST,
                            variables: { postId: this.postId }
                        });
                        data.getPost.likes -= 1;
                        cache.writeQuery({
                            query: GET_POST,
                            variables: { postId: this.postId },
                            data
                        });
                    }
                }).then(({ data }) => {
                    const updatedUser = { ...this.user, favorites: data.unlikePost.favorites };
                    this.$store.commit('setUser', updatedUser);
                })
                // .catch(err => console.error(err));
            }
        }
    }

</script>