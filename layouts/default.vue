<template>
  <v-app dark>
    <v-navigation-drawer dark color="primary" v-if="payload" app fixed :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer">
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
              <v-list-tile-title v-if="user">{{user.name}}</v-list-tile-title>
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
                  {{ game.title }}
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile v-for="subItem in game.stats" :key="subItem.title">
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
      <v-container style="padding:0px;" color="primary" fluid fill-height>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer id="footer" :fixed="fixed" app>
      <span>&copy; Synthèse WEB 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      stats: [
        { title: "-Nombre de coups", number: "10", icon: "bubble_chart" },
        { title: "-Nombre de carom", number: "1", icon: "timeline" }
      ],
      games: [
        {
          action: "local_activity",
          title: "Votre Jeu",
          stats: [
            { title: "Nombre de coups", number: "10", icon: "bubble_chart" },
            { title: "Nombre de carom", number: "1", icon: "timeline" }
          ]
        },
        {
          action: "local_activity",
          title: "Adversaire",
          stats: [
            { title: "Nombre de coups", number: "10", icon: "bubble_chart" },
            { title: "Nombre de carom", number: "1", icon: "timeline" }
          ]
        }
      ],
      mini: false,
      right: true,
      rightDrawer: false,
      title: "Billard Carom"
    };
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    logoutAndBackHome() {
      this.logout();
      this.$router.push("/login");
    }
  },
  computed: {
    ...mapState("auth", ["payload"]),
    ...mapGetters("users", {
      user: "current"
    })
  }
};
</script>
