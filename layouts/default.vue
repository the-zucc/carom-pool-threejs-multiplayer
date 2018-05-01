<template>
  <v-app dark>
    <v-navigation-drawer dark color="primary" v-if="this.$store.state.auth.payload" app fixed :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer">
        <v-list class="pa-1">
        <v-list-tile v-if="mini" @click.stop="mini = !mini">
          <v-list-tile-action>
            <v-icon>chevron_right</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile avatar tag="div">
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg" >
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>JM DESCHAMPS</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon @click.stop="drawer = !drawer">
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>

       <v-list class="pt-0" dark>
        <v-divider></v-divider>

        <nuxt-link to="/" router-exact-active-class>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>ACCUEIL</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        </nuxt-link>

        <v-divider></v-divider>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>accessibility</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Statistiques</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider></v-divider>

        <v-list-group v-model="game.active" v-for="game in games"
              :key="game.title" :prepend-icon="game.action" no-action >
              <v-list-tile slot="activator">
                <v-list-tile-content>
                  <v>{{ game.title }}</v>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile v-for="subItem in game.stats" :key="subItem.title" @click="">
                <v-list-tile-action>
                  <v-icon>{{ subItem.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ subItem.title }} : {{ subItem.number }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
          </v-list-group>

        <v-divider></v-divider>

      </v-list>

    </v-navigation-drawer>
    <v-toolbar app :clipped-left="$vuetify.breakpoint.lgAndUp" fixed color="primary" dark>
      <v-toolbar-side-icon v-if="this.$store.state.auth.payload" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
       <i class="material-icons">bubble_chart</i>
       <v-toolbar-title v-text="title" class="white--text">
       </v-toolbar-title>
       <v-spacer></v-spacer>
       <v-btn flat v-if="this.$store.state.auth.payload" v-on:click="logoutAndBackHome()">Logout</v-btn>
    </v-toolbar>
    <v-content>
      <v-container color="primary" fluid fill-height>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; Synthèse WEB 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      stats: [
        { title: '-Nombre de coups', number : '10', icon: 'bubble_chart' },
        { title: '-Nombre de carom', number : '1', icon: 'timeline' }
      ],
      games: [
        {
          action: 'local_activity',
          title: 'Partie 1',
          stats: [
            { title: 'Nombre de coups', number : '10', icon: 'bubble_chart' },
            { title: 'Nombre de carom', number : '1', icon: 'timeline' }
          ]
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Billard Carom"
    };
  },
  methods: {
    ...mapActions('auth', ['logout']),
    logoutAndBackHome () {
      this.logout();
      this.$router.push("/login");
    }
  }
};
</script>
