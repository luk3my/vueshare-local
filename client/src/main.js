import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";

import Vuelidate from "vuelidate";

import router from "./router";
import store from "./store";

import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

import FormAlert from './components/Shared/FormAlert';

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

//Register globally
Vue.component('form-alert', FormAlert);
Vue.use(BootstrapVue);
Vue.use(VueApollo);
Vue.use(Vuelidate);

// Setup Apollo Client
export const defaultClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  //Include Auth token with request made to backend
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    //If no token with the key of 'token in local storage, add it
    if (!localStorage.token) {
      localStorage.setItem("token", "");
    }
    //Operation adds the token to the auth header, which is sent to backend
    operation.setContext({
      headers: {
        authorization: localStorage.getItem("token")
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log("[networkError]", networkError);
    }
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);
      }
    }
  }
});

const apolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false;

new Vue({
  provide: apolloProvider.provide(),
  router,
  store,
  render: h => h(App),
  created() {
    // execute getCurrentUser query
    this.$store.dispatch('getCurrentUser');
  }
}).$mount("#app");
