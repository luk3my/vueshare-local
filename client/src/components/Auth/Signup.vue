<template>
    <b-container style="width: 50%; margin-top: 30px;">
        <b-card>
            <!-- Error Alert -->
            <div v-if="error">
                <form-alert :message="error.message"></form-alert>
            </div>

            <!-- Signup Title and form-->

            <h1>Sign Up</h1>

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
                    <b-form-group id="input-group-2" label="Email address:" label-for="input-2">
                        <b-form-input id="input-2" v-model.trim="$v.email.$model" :class="{'is-invalid':$v.email.$error, 'is-valid': !$v.email.$invalid}"
                         type="email" required placeholder="Enter email (john@mail.com)"></b-form-input>
                    </b-form-group>
                    <div class="valid-feedback valid">Email is valid.</div>
                        <div class="invaild-feedback invalid">
                            <span v-if="!$v.email.required">Email is not a vaild format</span>
                        </div>
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
                    <b-form-group id="input-group-3" label="Confrim Password:" label-for="input-3">
                        <b-form-input id="input-3" v-model.trim="$v.passwordConfirmation.$model" :class="{'is-invalid': $v.passwordConfirmation.$error, 'is-valid': (password != '') ? !$v.passwordConfirmation.$invalid : ''}"
                            type="password" required placeholder="Re enter password"></b-form-input>
                        <div class="valid-feedback valid">Password is Identical.</div>
                        <div class="invaild-feedback invalid">
                            <span v-if="!$v.passwordConfirmation.sameAsPassword">Passwords must be identical</span>
                        </div>
                    </b-form-group>


                    <!-- <b-button type="submit" variant="primary" style="margin-right: 20px;">Sign Up</b-button> -->
                    <b-button v-if="loading" variant="primary" disabled>
                        <b-spinner small type="grow"></b-spinner>
                        Signing Up.
                    </b-button>

                    <b-button v-else-if="!loading" :disabled="loading" variant="primary" type="submit">{{submitstatus}}</b-button>
                </b-form>
            </div>

            <p style="margin-top: 20px;">Already have an account?
                <router-link to="/signin">Sign In here</router-link>
            </p>
        </b-card>
    </b-container>

</template>

<script>
    import { required, minLength, maxLength, between, email, sameAs } from 'vuelidate/lib/validators';
    import { mapGetters } from 'vuex';

    export default {
        name: 'Signup',
        data() {
            return {
                username: '',
                email: '',
                password: '',
                passwordConfirmation: '',
                submitstatus: 'Sign In'

            }
        },
        validations: {
            username: {
                required,
                minLength: minLength(3),
                maxLength: maxLength(10)
            },
            email: {
                required,
                email
            },
            password: {
                required,
                minLength: minLength(6),
                maxLength: maxLength(12)
            },
            passwordConfirmation: {
                sameAsPassword: sameAs('password')
            },

        },
        computed: {
            ...mapGetters(['loading', 'error', 'user'])
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
            handleSignupUser() {
                //Signup user action
                this.$store.dispatch('signupUser', {
                    username: this.username,
                    email: this.email,
                    password: this.password
                })
            },
            submitForm() {
                this.$v.$touch()
                if (this.$v.$invalid) {
                    this.submitstatus = "Re-try"; 
                } else {
                    this.handleSignupUser();
                    this.submitstatus = "Success";
                }
            }
        }
    };

</script>