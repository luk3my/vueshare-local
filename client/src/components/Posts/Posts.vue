<template>

    <b-container class="bv-example-row" v-if="infiniteScrollPosts">
        <b-row class="justify-content-sm-center" style="margin-top: 10px;">
            <b-col v-for="post in infiniteScrollPosts.posts" :key="post._id" cols="12" md="4" style="margin-bottom: 15px;">
                <div class="card" style="width: 100%; box-shadow: 2px 10px 10px rgba(0,0,0,0.3)">
                    <img @click="goToPost(post._id)" class="card-img-top" style="cursor: pointer" height="200px" :src="post.imageUrl" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">{{post.title}}</h5>
                        <p class="card-text">{{post.description}} <span @click="showPostCreator = !showPostCreator" style="font-weight: bold; cursor: pointer;"><i style="font-size: 20px; float: right;" class="fas fa-chevron-circle-down"></i></span></p>

                    </div>
                    <div class="card-footer text-muted" v-show="showPostCreator">
                        <img :src="post.createdBy.avatar" height="25px"> <span>{{post.createdBy.username}}</span><br>
                        <small>Added: {{formatCreatedDate(post.createdDate)}}</small>
                    </div>
                </div>
            </b-col>
        </b-row>
        <b-row align-h="center" style="margin-top: 20px;">
            <b-col cols="1">
                <b-button @click="showMorePosts" v-if="showMoreEnabled">More</b-button>
            </b-col>
        </b-row>
    </b-container>

</template>

<script>
    import { INFINITE_SCROLL_POSTS } from '../../queries';
    import moment from 'moment';


    const pageSize = 6;

    export default {
        name: "Posts",
        data() {
            return {
                pageNum: 1,
                showMoreEnabled: true,
                showPostCreator: false
            }
        },
        apollo: {
            infiniteScrollPosts: {
                query: INFINITE_SCROLL_POSTS,
                variables: {
                    pageNum: 1,
                    pageSize
                }
            }
        },
        methods: {
            formatCreatedDate(date) {
              return moment(new Date(date)).format('ll');  
            },
            showMorePosts() {
                this.pageNum += 1;
                //Fetch more data and transform original result
                this.$apollo.queries.infiniteScrollPosts.fetchMore({
                    variables: {
                        //PageNum incrememted by 1
                        pageNum: this.pageNum,
                        pageSize
                    },
                    updateQuery: (prevResult, { fetchMoreResult }) => {
                        const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
                        const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;
                        this.showMoreEnabled = hasMore;

                        return {
                            infiniteScrollPosts: {
                                __typename: prevResult.infiniteScrollPosts.__typename,
                                //Merge previous posts with new posts
                                posts: [
                                    ...prevResult.infiniteScrollPosts.posts,
                                    ...newPosts
                                ],
                                hasMore
                            }
                        }
                    }
                })
            },
            goToPost(postId) {
                this.$router.push(`/posts/${postId}`)
            }
        }
    };

</script>