<template>
    <b-container style="margin-top: 30px; width: 50%">
        <b-card>
        <!-- Add Post Title and form-->

        <h1>Add Post</h1>

        <div>
            <b-form @submit.prevent="handleAddPost">

                <!-- Title Input -->
                <b-form-group id="input-group-1" label="Post Title:" label-for="input-1">
                    <b-form-input id="input-1" v-model="title" type="text" required placeholder="Enter a post tilte"></b-form-input>
                </b-form-group>

                <!-- Image Url Input-->
                <b-form-group id="input-group-2" label="Image Url:" label-for="input-2">
                    <b-form-input id="input-2" v-model="imageUrl" type="text" required placeholder="Enter a an image URL"></b-form-input>
                </b-form-group>

                <!-- Image Preview -->
                <div class="text-center">
                    <b-img :src="imageUrl" height="300px" center thumbnail alt="Image preview"></b-img>
                </div>

                <!-- Categories Select -->
                <b-form-group id="input-group-3" label="Categoties:" label-for="input-3">
                    <b-form-select id="input-3" v-model="categories" :options="['art', 'travel', 'nature', 'cityscape', 'animals', 'weather', 'food', 'music']" required></b-form-select>
                </b-form-group>

                <!-- Description Text Area -->
                <b-form-group id="input-group-4" label="Description:" label-for="input-4">
                    <b-form-textarea id="textarea" v-model="description" placeholder="Enter a description of the post" rows="3" max-rows="6"></b-form-textarea>
                </b-form-group>


                <!-- <b-button type="submit" variant="primary" style="margin-right: 20px;">Sign Up</b-button> -->
                <b-button v-if="loading" variant="primary" disabled>
                    <b-spinner small type="grow"></b-spinner>
                    Adding Post.
                </b-button>

                <b-button v-else-if="!loading" :disabled="loading" variant="primary" type="submit">Add</b-button>
            </b-form>
        </div>
        </b-card>
    </b-container>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'AddPost',
        computed: {
            ...mapGetters(['loading', 'user'])
        },
        data() {
            return {
                title: '',
                imageUrl: '',
                categories: [],
                description: ''
            }
        },
        methods: {
            handleAddPost() {
                //Add post action - Add some vaidation logic when availabe
                this.$store.dispatch('addPost', {
                    title: this.title,
                    imageUrl: this.imageUrl,
                    categories: this.categories,
                    description: this.description,
                    creatorId: this.user._id
                });
                this.$router.push('/');
            }
        }
    }

</script>