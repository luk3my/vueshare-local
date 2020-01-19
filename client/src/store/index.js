import Vue from "vue";
import Vuex from "vuex";
import router from "../router/index";

import { defaultClient as ApolloClient } from "../main";

import {
  GET_CURRENT_USER,
  GET_POSTS,
  GET_USER_POSTS,
  SIGNIN_USER,
  SIGNUP_USER,
  ADD_POST,
  DELETE_USER_POST,
  INFINITE_SCROLL_POSTS
} from "../queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    userPosts: [],
    user: null,
    loading: false,
    error: null
  },
  // Update(mutate) the values of the original state after the user has made changes
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    clearUser: state => (state.user = null),
    clearError: state => (state.error = null)
  },
  actions: {
    // Get current user
    getCurrentUser: ({ commit }) => {
      commit("setLoading", true);
      ApolloClient.query({
        query: GET_CURRENT_USER
      })
        .then(({ data }) => {
          commit("setLoading", false);
          //Add user to state
          commit("setUser", data.getCurrentUser);
          console.log(data.getCurrentUser);
        })
        .catch(err => {
          commit("setLoading", false);
          console.error(err);
        });
    },
    // Get Posts
    getPosts: ({ commit }) => {
      commit("setLoading", true);
      // use ApolloClient to fire getPosts query
      ApolloClient.query({
        query: GET_POSTS
      })
        .then(({ data }) => {
          // Get data from actions and pass to state via mutation
          // Commit passes data from actions along to a mutation function
          commit("setPosts", data.getPosts);
          commit("setLoading", false);
        })
        .catch(err => {
          commit("setLoading", false);
          console.log(err);
        });
    },
    //Get User Posts
    getUserPosts: ({ commit }, payload) => {
      ApolloClient.query({
        query: GET_USER_POSTS,
        variables: payload
      })
        .then(({ data }) => {
          commit("setUserPosts", data.getUserPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    // Add Posts
    addPost: ({ commit }, payload) => {
      ApolloClient.mutate({
        mutation: ADD_POST,
        variables: payload,
        update: (cache, { data: { addPost } }) => {
          //Read data from the query to be updated
          const data = cache.readQuery({ query: GET_POSTS });
          //Create Updated data
          data.getPosts.unshift(addPost);
          //Write updated data back to query
          cache.writeQuery({
            query: GET_POSTS,
            data
          });
        },
        //Ensures data is added immediately as specified for the update function
        optimisticResponse: {
          __typename: "Mutation",
          addPost: {
            __typename: "Post",
            _id: -1,
            ...payload
          }
        },
        //Rerun specified queries after performing the muation to get fresh data
        refetchQueries: [
          {
            query: INFINITE_SCROLL_POSTS,
            variables: {
              pageNum: 1,
              pageSize: 6
            }    
          }
        ]
      })
        .then(({ data }) => {
          // console.log(data.addPost);
        })
        .catch(err => {
          console.error(err);
        });
    },
    //Delete User Post
    deleteUserPost: ({ state, commit }, payload) => {
      ApolloClient.mutate({
        mutation: DELETE_USER_POST,
        variables: payload
      })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.deleteUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPosts.slice(index + 1)
          ];
          commit("setUserPosts", userPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    // Sign in a user
    signinUser({ commit }, payload) {
      commit("clearError");
      commit("setLoading", true);
      ApolloClient.mutate({
        mutation: SIGNIN_USER,
        variables: payload
      })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signinUser.token);
          // to make sure created method is run in main.js- run getCurrentUser, reload the page
          router.go();
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    // Sign up new user
    signupUser({ commit }, payload) {
      commit("clearError");
      commit("setLoading", true);
      ApolloClient.mutate({
        mutation: SIGNUP_USER,
        variables: payload
      })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signupUser.token);
          // to make sure created method is run in main.js- run getCurrentUser, reload the page
          router.go();
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    // Sign out user
    signoutUser: async ({ commit }) => {
      //Clear user in sate
      commit("clearUser");
      //Remove user in local storage
      localStorage.setItem("token", "");
      //End the session
      await ApolloClient.resetStore();
      //Redirect home - disallow acess to private pages
      router.push("/");
    }
  },
  // Get state for use in views
  getters: {
    posts: state => state.posts,
    userPosts: state => state.userPosts,
    user: state => state.user,
    userFavorites: state => state.user && state.user.favorites,
    loading: state => state.loading,
    error: state => state.error
  },

  modules: {}
});
