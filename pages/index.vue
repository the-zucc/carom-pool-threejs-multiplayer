<template>
  <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3 text-xs-center v-if="parties.length == 0">
        <h2 text-xs-center class="mb-1">AJOUTER DES PARTIES</h2>
        <hr class="mb-2">
        <v-spacer></v-spacer>
          <v-chip color="red" text-color="white" v-on:click="createPartie({type:3})">
            <v-avatar><v-icon class="red darken-4">add</v-icon></v-avatar>Carom 3 bandes
          </v-chip>
          <v-chip color="orange" text-color="white" v-on:click="createPartie({type:1})">
            <v-avatar><v-icon class="orange darken-4">add</v-icon></v-avatar>Carom 1 bande
          </v-chip>

          <v-chip color="green" text-color="white" v-on:click="createPartie({type:0})">
            <v-avatar><v-icon class="green darken-4" >add</v-icon></v-avatar>Carom Libre
          </v-chip>
        <v-spacer></v-spacer>  
      </v-flex>
    
    <v-flex xs12 sm4 class="pa-1" v-for="item in parties" :key="item.id">
        <v-card dark raised color="primary">
          <v-card-media src="https://www.axonpost.com/wp-content/uploads/2018/02/billard-696x463.jpg" height="200px">
          </v-card-media>
          <v-card-title primary-title>
            <v-flex xs12 text-xs-center>
              <h3 class="headline">Carom {{item.type+1}} bande(s)</h3>
               <div xs12 text-xs-center></div>
            </v-flex>
          </v-card-title>
          <v-card-actions >
             <v-flex xs12 text-xs-center>
               <v-btn color="orange" v-on:click="joinPartie(item)">Sélectionner</v-btn>
               <!--v-btn color="orange" v-on:click="deletePartie(item)">Supprimer</v-btn-->
             </v-flex>
          </v-card-actions>
        </v-card>
    </v-flex>
    <v-speed-dial v-model="fab" bottom right :direction="direction" :transition="transition" fixed style="right:25px;bottom:50px" >
        <v-btn slot="activator" color="blue darken-2" dark fab hover v-model="fab" >
        <v-icon>add</v-icon>
        <v-icon>close</v-icon></v-btn>
      <v-chip color="red" text-color="white" v-on:click="createPartie({type:2, joueurs:[undefined, undefined], joueurCourant:0})">
        <v-avatar><v-icon class="red darken-4">add</v-icon></v-avatar>Carom 3 bandes
      </v-chip>
      <v-chip color="orange" text-color="white" v-on:click="createPartie({type:1, joueurs:[undefined, undefined], joueurCourant:0})">
        <v-avatar><v-icon class="orange darken-4">add</v-icon></v-avatar>Carom 1 bande
      </v-chip>
      <v-chip color="green" text-color="white" v-on:click="createPartie({type:0, joueurs:[undefined, undefined], joueurCourant:0})">
        <v-avatar><v-icon class="green darken-4" >add</v-icon></v-avatar>Carom Libre
      </v-chip>
    </v-speed-dial>
  </v-layout>
  
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  transition(to, from) {
    if (!from) return "slide-left";
    if (to.query.page != 0)
      return to.query.page < from.query.page ? "slide-right" : "slide-left";
  },
  data() {
    return {
      items: [
        {
          id: "0",
          titre: "Carom Libre",
          desc: "1 Un des meilleur jeux au monde",
          color: "green",
          link: "/carom?type=0"
        },
        {
          id: "1",
          titre: "Carom 1 bande",
          desc: "2 Un des meilleur jeux au monde",
          color: "orange",
          link: "/carom?type=1"
        },
        {
          id: "3",
          titre: "Carom 3 bandes",
          desc: "3 Un des meilleur jeux au monde",
          color: "red",
          link: "/carom?type=3"
        }
      ],

      direction: "left",
      direction2: "down",
      fab: false,
      fling: false,
      hover: true,
      tabs: null,
      transition: "slide-y-reverse-transition"
    };
  },
  methods: {
    joinPartie(partie) {
      console.log(partie);
      this.$router.push("/carom?partie="+partie._id);
    },
    addPartie(index) {
      // this.parties.push(this.items[index]); // what to push unto the rows array?
    },
    ...mapActions("parties", {
      findParties: "find",
      createPartie: "create",
      deletThis: "remove"
    }),
    deletePartie(partie){
      this.deletThis(partie._id);
    }
  },
  created() {
    this.findParties({query: {}});
  },
  computed: {
    ...mapGetters("parties", {
      findPartiesInStore: "find"
    }),
    parties() {
      return this.findPartiesInStore({query: {}}).data
    }
  }
};
</script>

