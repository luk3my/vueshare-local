<template>
    <b-container class="bv-example-row bv-example-row-flex-cols">
        <b-row class="row d-flex justify-content-center">
            <b-col class="col-md-6">
                <b-card>
                    <h2>{{user.username}}</h2>
                    <img style="float: right; margin-top: -50px" :src="user.avatar" alt="user avatar">
                    <b-card-text>
                        <b>Joined:</b> {{formatJoinDate(user.joinDate)}}
                    </b-card-text>

                    <span><b>{{user.favorites.length}}</b> Favorites <b>{{userPosts.length}}</b> Posts Added</span>
                </b-card>
            </b-col>
        </b-row>
        <!-- Posts favorited by user -->
        <b-row class="row d-flex justify-content-center" v-if="!userFavorites.length">
            <b-col class="col-md-6" style="text-align: center; margin-top: 20px;">
                <h4>You have no favorites currently... Try liking some photos!</h4>
            </b-col>
        </b-row>

        <!-- Favorited Posts -->
        <b-card v-if="userFavorites.length" style="margin-top: 15px;">
            <b-row class="row d-flex justify-content-center">
                <b-col class="col-md-6" style="text-align: center; margin-top: 20px;">
                    <h5>Favorited - {{user.favorites.length}}</h5>
                </b-col>
            </b-row>

            <div class="bv-example-row" v-if="userFavorites.length">
                <b-row class="justify-content-sm-center" style="margin-top: 15px;">
                    <b-col v-for="favorite in userFavorites" :key="favorite._id" cols="12" md="3" style="margin-bottom: 15px;">
                        <div class="card" style="width: 100%; box-shadow: 2px 10px 10px rgba(0,0,0,0.3)">
                            <img @click="goToPost(favorite._id)" class="card-img-top" style="cursor: pointer" height="200px" :src="favorite.imageUrl"
                                alt="Card image cap">
                            <div class="card-body">
                                <h5 class="card-title">{{favorite.title}}</h5>
                            </div>
                        </div>
                    </b-col>
                </b-row>
            </div>
        </b-card>

        <!-- If no posts added by user -->
        <b-row class="row d-flex justify-content-center" v-if="!userPosts.length">
            <b-col class="col-md-6" style="text-align: center; margin-top: 20px;">
                <h4>There are no posts added by you... Try adding some!</h4>
            </b-col>
        </b-row>

        <!-- User Added Posts -->
        <b-card v-if="userPosts.length" style="margin-top: 15px;">
            <b-row class="row d-flex justify-content-center">
                <b-col class="col-md-6" style="text-align: center; margin-top: 20px;">
                    <h5>Your Posts - {{userPosts.length}}</h5>
                </b-col>
            </b-row>

            <div class="bv-example-row">
                <b-row class="justify-content-sm-center" style="margin-top: 15px;">
                    <b-col v-for="post in userPosts" :key="post._id" cols="12" md="3" style="margin-bottom: 15px;">
                        <div class="card" style="width: 100%; box-shadow: 2px 10px 10px rgba(0,0,0,0.3)">
                            <img @click="goToPost(post._id)" class="card-img-top" style="cursor: pointer" height="200px" :src="post.imageUrl" alt="Card image cap">
                            <div class="card-body">
                                <b-button @click="handleDeleteUserPost(post)" style="float: right">Delete</b-button>
                                <h5 class="card-title">{{post.title}}</h5>
                            </div>
                        </div>
                    </b-col>
                </b-row>
            </div>
        </b-card>


    </b-container>
</template>

<script>
    import { mapGetters } from 'vuex';
    import moment from 'moment';

    export default {
        name: 'Profile',
        computed: {
            ...mapGetters(['user', 'userFavorites', 'userPosts'])
        },
        created() {
            this.handleGetUserPosts();
        },
        methods: {
            formatJoinDate(date) {
              return moment(new Date(date)).format('lll');  
            },
            goToPost(postId) {
                this.$router.push(`/posts/${postId}`)
            },
            handleGetUserPosts() {
                this.$store.dispatch('getUserPosts', {
                    userId: this.user._id
                });
            },
            handleDeleteUserPost(post) {
                this.loadPost(post, false);
                const deletePost = window.confirm('Are You Sure You Want To Delete This Post?')
                if (deletePost) {
                    this.$store.dispatch('deleteUserPost', {
                        postId: this.postId
                    });
                }
            },
            loadPost(
                { _id, title, imageUrl, categories, description }
            ) {
                this.postId = _id;
                this.title = title;
                this.imageUrl = imageUrl;
                this.categories = categories;
                this.description = description;
            }
        }
    }

</script>