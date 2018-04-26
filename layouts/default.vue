<template>
  <v-app dark>

    <v-toolbar class="text-xs-center">
      <v-flex>
       <v-toolbar-title v-text="title">
       </v-toolbar-title>
       <i class="material-icons">bubble_chart</i>
      </v-flex>
    </v-toolbar>
    <v-content>
      <v-container >
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
