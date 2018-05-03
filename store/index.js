import feathersVuex, { initAuth } from "feathers-vuex";
import feathersClient from "@/api/feathers-client";

const { service, auth } = feathersVuex(feathersClient, { idField: "_id" });

export const state = () => ({
  
});

export const actions = {
  nuxtServerInit({ commit, dispatch }, { req }) {
    return initAuth({
      commit,
      dispatch,
      req,
      moduleName: "auth",
      cookieName: "feathers-jwt"
    });
  }
};

export const plugins = [
  service("parties"),
  service("users"),
  service("coups"),
  auth({ userService: "users", store: { publicPages: ["login"] } })
];