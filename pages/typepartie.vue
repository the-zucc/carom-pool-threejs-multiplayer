<template>
  <v-layout>
    <v-flex xs12 sm4 class="pa-1">
      <v-flex>
      <v-card>
        <v-card-media src="https://www.axonpost.com/wp-content/uploads/2018/02/billard-696x463.jpg" height="200px">
        </v-card-media>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Carom Libre</h3>
            <div>Un des meilleur jeux au monde</div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn color="orange ">Sélectionner</v-btn>
        </v-card-actions>
      </v-card>
      </v-flex>
    </v-flex>
    <v-flex xs12 sm4 class="pa-1">
      <v-flex>
      <v-card>
        <v-card-media src="https://www.axonpost.com/wp-content/uploads/2018/02/billard-696x463.jpg" height="200px">
        </v-card-media>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Carom 1 bande</h3>
            <div>Un des meilleur jeux au monde</div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn color="blue">Sélectionner</v-btn>
        </v-card-actions>
      </v-card>
      </v-flex>
    </v-flex>

    <v-flex xs12 sm4 class="pa-1">
      <v-flex>
      <v-card>
        <v-card-media src="https://www.axonpost.com/wp-content/uploads/2018/02/billard-696x463.jpg" height="200px">
        </v-card-media>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Carom 3 bandes</h3>
            <div>Un des meilleur jeux au monde</div>
          </div>
        </v-card-title>
        <v-card-actions>
          <nuxt-link to="/caromlibre"><v-btn color="green">Sélectionner</v-btn></nuxt-link>
        </v-card-actions>
      </v-card>
      </v-flex>
    </v-flex>
  </v-layout>
</template>