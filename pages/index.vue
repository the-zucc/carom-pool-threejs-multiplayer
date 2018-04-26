<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Login form</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field prepend-icon="person" name="login" label="Login" type="text"></v-text-field>
            <v-text-field prepend-icon="lock" name="password" label="Password" id="password" type="password"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <nuxt-link to="/signup?page=2">
            <v-btn color="secondary">Register</v-btn>
          </nuxt-link>
          <v-spacer></v-spacer>
          <nuxt-link to="/typepartie?page=2">
            <v-btn color="primary">Login</v-btn>
          </nuxt-link>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
  export default {
    transition (to, from) {
      if (!from) return 'slide-left';
      if(to.query.page) return +to.query.page < +from.query.page ? 'slide-right' : 'slide-left';
      else return 'slide-right';
    },
    created () {
      // comme le window.onload() mais pour le composant
    },
    methods: {
      login () {
        // la fonction de login
      }
    }
  }
</script>