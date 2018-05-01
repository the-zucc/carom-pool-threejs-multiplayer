import Vue from "vue"; // eslint-disable-line import/no-extraneous-dependencies
import Vuex from "vuex"; // eslint-disable-line import/no-extraneous-dependencies
import feathersVuex, { initAuth } from "feathers-vuex";
import feathersClient from "./feathers-client";

const { service, auth } = feathersVuex(feathersClient, { idField: "_id" });

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  actions: {
    nuxtServerInit({ commit, dispatch }, { req }) {
      return initAuth({
        commit,
        dispatch,
        req,
        moduleName: "auth",
        cookieName: "feathers-jwt"
      });
    }
  },
  plugins: [
    service("parties"),
    service("users"),
    auth({ userService: "users", store: { publicPages: ["login"] } })
  ]
});

export default () => store;
