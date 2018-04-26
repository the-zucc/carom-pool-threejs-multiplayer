<template>
  <v-layout>
    <v-flex xs12 sm4 class="pa-1" v-for="item in items" :key="item.id">
      <v-flex>
        <v-card light raised>
          <v-card-media src="https://www.axonpost.com/wp-content/uploads/2018/02/billard-696x463.jpg" height="200px">
          </v-card-media>
          <v-card-title primary-title>
            <v-flex xs12 text-xs-center>
              <h3 class="headline">{{item.titre}}</h3>
               <div xs12 text-xs-center>{{item.desc}}</div>
            </v-flex>
          </v-card-title>
          <v-card-actions >
             <v-flex xs12 text-xs-center>
              
                <nuxt-link :to="item.link"><v-btn :color="item.color">Sélectionner</v-btn></nuxt-link>
              
             </v-flex>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    transition (to, from) {
      if (!from) return 'slide-left';
      if(to.query.page!=0) return to.query.page < from.query.page ? 'slide-right' : 'slide-left';
    },
    data(){
      return ({
        items: [
          { id:'1', titre: 'Carom Libre', desc:'1 Un des meilleur jeux au monde', color:'blue',  link:"/caromlibre"},
          { id:'2', titre: 'Carom 1 bande', desc:'2 Un des meilleur jeux au monde', color:'orange', link:"/carom1bande"},
          { id:'3', titre: 'Carom 3 bandes', desc:'3 Un des meilleur jeux au monde', color:'green', link:"/carom3bandes"}
        ]
      })
    } 
  }

</script>