<template>

    <b-container style="width: 50%; margin-top: 30px;">
        <b-card>
            <!-- Error Alert -->
            <div v-if="error">
                <form-alert :message="error.message"></form-alert>
            </div>

            <!-- Signin Title and form-->
            <h1>Sign In</h1>

            <div>
                <b-form @submit.prevent="submitForm">
                    <b-form-group id="input-group-1" label="Username:" label-for="input-1">
                        <b-form-input id="input-1" v-model.trim="$v.username.$model" :class="{'is-invalid':$v.username.$error, 'is-valid': !$v.username.$invalid}"
                            type="text" required placeholder="Enter User Name"></b-form-input>
                        <div class="valid-feedback valid">Username is valid.</div>
                        <div class="invaild-feedback invalid">
                            <span v-if="!$v.username.required">Username is required</span>
                            <span v-if="!$v.username.minLength">Username must be at least {{$v.username.$params.minLength.min}} letters</span>
                            <span v-if="!$v.username.maxLength">Username must not exceed {{$v.username.$params.maxLength.max}} letters</span>
                        </div>
                    </b-form-group>


                    <b-form-group id="input-group-3" label="Password:" label-for="input-3">
                        <b-form-input id="input-3" v-model.trim="$v.password.$model" :class="{'is-invalid':$v.password.$error, 'is-valid': !$v.password.$invalid}"
                            type="password" required placeholder="Enter password"></b-form-input>
                        <div class="valid-feedback valid">Password is valid.</div>
                        <div class="invaild-feedback invalid">
                            <span v-if="!$v.password.required">Password is required</span>
                            <span v-if="!$v.password.minLength">Password must be at least {{$v.password.$params.minLength.min}} letters</span>
                            <span v-if="!$v.password.maxLength">Password must not exceed {{$v.password.$params.maxLength.max}} letters</span>
                        </div>
                    </b-form-group>


                    <!-- <b-button type="submit" variant="primary" style="margin-right: 20px;">Sign Up</b-button> -->
                    <b-button v-if="loading" variant="primary" disabled>
                        <b-spinner small type="grow"></b-spinner>
                        Signing In.
                    </b-button>

                    <b-button class="was-validated" v-else-if="!loading" :disabled="loading && state" variant="primary" type="submit"> {{ submitstatus }}</b-button>
                </b-form>
            </div>

            <p style="margin-top: 15px;">Don't have an account yet?
                <router-link to="/signup">Sign up here</router-link>
            </p>
        </b-card>
    </b-container>

</template>

<script>
    import { required, minLength, maxLength, between } from 'vuelidate/lib/validators';
    import { mapGetters } from 'vuex';

    export default {
        name: 'Signin',
        data() {
            return {
                username: '',
                password: '',
                submitstatus: 'Sign In'
            }
        },
        validations: {
            username: {
                required,
                minLength: minLength(3),
                maxLength: maxLength(10)
            },
            password: {
                required,
                minLength: minLength(6),
                maxLength: maxLength(12)
            }
        },
        computed: {
            ...mapGetters(["loading", "error", "user"])
        },
        watch: {
            user(value) {
                //If user value changes -redirect to the home page
                if (value) {
                    this.$router.push("./");
                }
            }
        },
        methods: {
            handleSigninUser() {
                this.$store.dispatch('signinUser', {
                    username: this.username,
                    password: this.password
                });
            },
            submitForm() {
                this.$v.$touch()
                if (this.$v.$invalid) {
                    this.submitstatus = "Re-try"; 
                } else {
                    this.handleSigninUser();
                    this.submitstatus = "Success";
                }
            }
        }
    };

</script>

<style>
    .invalid {
        color: red;
    }

    .valid {
        color: green;
    }
</style>