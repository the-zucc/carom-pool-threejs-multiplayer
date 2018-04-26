<template>
	<div>
		<div class="text-xs-center">
			<h1>CAROM À UNE BANDE</h1>
			</div>
		<div class="">
			<nuxt-link to="/typepartie">
				<v-btn round color="primary" dark>RETOUR</v-btn>
			</nuxt-link>  
			<v-btn round color="primary" v-on:click="start()" dark>PARTIE</v-btn>
			<div id="carom-container" style="position:fixed;top:20%;left:0px; border:2px solid; height:76%;width:100%;"></div>
		</div>
	</div>
</template>
<script>
import carom from 'assets/js/Carom.js';
export default {
	created () {
		//carom.demarrerPartie();
	},
	methods: {
		start(){
			carom.demarrerPartie();
		}
	}
}
</script>