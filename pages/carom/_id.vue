<template>
	<v-layout>
		<v-flex >
			<h1>CAROM À UNE BANDE</h1>
		</v-flex>
		<div class="">
			<nuxt-link to="/">
				<v-btn round color="primary" dark>RETOUR</v-btn>
			</nuxt-link>  
			<div id="carom-container" style="position:fixed;top:20%;left:0px; border:2px solid; height:76%;width:100%;"></div>
		</div>
	</v-layout>
</template>
<script>
import carom from 'assets/js/Carom.js';
export default {
	mounted () {
		carom.demarrerPartie();
	}
}
</script>