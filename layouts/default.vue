<template>
  <v-app dark>
    <v-navigation-drawer app fixed :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer"></v-navigation-drawer>
    <v-toolbar app :clipped-left="$vuetify.breakpoint.lgAndUp" fixed color="primary" dark>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
       <i class="material-icons">bubble_chart</i>
       <v-toolbar-title v-text="title" class="white--text">
       </v-toolbar-title>
       <v-spacer></v-spacer>
       <v-btn flat>Logout</v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; Synthèse WEB 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        clipped: true,
        drawer: true,
        fixed: false,
        items: [
          { icon: 'apps', title: 'Welcome', to: '/' }
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'CAROM-POOL'
      }
    }
  }
</script>
