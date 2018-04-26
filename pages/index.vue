<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Login form</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field prepend-icon="person" name="email" label="Email" type="text" v-model="email"></v-text-field>
            <v-text-field prepend-icon="lock" name="password" label="Password" id="password" type="password" v-model="password"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <nuxt-link to="/signup">
            <v-btn color="secondary">Register</v-btn>
          </nuxt-link>
          <v-spacer></v-spacer>
            <v-btn color="primary" v-on:click="login(email, password)">Login</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
  import { mapActions } from "vuex"

  export default {
    data () {
      return {
        email: undefined,
        password: undefined,
        error: undefined
      }
    },
    methods: {
      login (email, password) {
        this.authenticate({strategy: 'local', email, password})
          .then(()=>{
            this.$nuxt.$router.push("/typepartie");
          })
          .catch(error => {
          // Convert the error to a plain object and add a message.
            let type = error.className
            error = Object.assign({}, error)
            error.message = (type === 'not-authenticated')
              ? 'Incorrect email or password.'
              : 'An error prevented login.'
            this.error = error
        })
      },
      ...mapActions('auth', ['authenticate'])
    }
  }
</script>