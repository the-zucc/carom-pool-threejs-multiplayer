<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title v-if="register == false">Login form</v-toolbar-title>
          <v-toolbar-title v-if="register == true">Register form</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field prepend-icon="person" name="email" label="Email" type="text" v-model="email"></v-text-field>
            <v-text-field v-if="register == true" prepend-icon="person" name="email" label="Nom" type="text" v-model="nom"></v-text-field>
            <v-text-field prepend-icon="lock" name="password" label="Password" id="password" type="password" v-model="password"></v-text-field>
            <v-text-field v-if="register == true" prepend-icon="lock" name="password" label="Password confirmation" id="password" type="password" v-model="password2"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <nuxt-link to="/signup?page=2">
            <v-btn v-if="register == false" color="secondary" v-on:click="toggleRegister()">Register</v-btn>
            <v-btn v-if="register == true" color="secondary" v-on:click="toggleRegister()">Back</v-btn>
          </nuxt-link>
          <v-spacer></v-spacer>
            <v-btn v-if="register == false" color="primary" v-on:click="login(email, password)">Login</v-btn>
            <v-btn v-if="register == true" color="primary" v-on:click="submit()">Submit</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
        <v-alert type="error" :value="error">Error(s) in the form bruh, wtf</v-alert>
        <v-alert type="success" :value="registered">Registered</v-alert>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
  import { mapActions } from "vuex"

  export default {
    data () {
      return {
        email: "",
        nom: "",
        password: "",
        password2: "",
        error: false,
        register:false,
        registered:false
      }
    },
    methods: {
      toggleRegister () {
        if(this.register)
          this.register = false;
        else
          this.register = true;
      },
      submit () {
        /*
        if(this.email == "" || this.nom == "" || this.password.length == "" || this.password2.length == "")
          this.error = true;
        else if(this.password != this.password2)
          this.error = true;
        else
          this.error = false;
        
        if(!this.error){// si erreur n'est pas true
          this.register = false;
          this.registered = true;
        }
        */
      }
      ,
      login (email, password) {
        this.authenticate({strategy: 'local', email, password})
          .then(()=>{
            this.$router.push("/");
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