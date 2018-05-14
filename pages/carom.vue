<template>
	<v-layout>
		<v-flex id="carom-container"></v-flex>
	</v-layout>
</template>
<script>
import CaromController from 'assets/js/Engine/Game.js';
import { mapGetters, mapActions } from 'vuex';
export default {
	mounted () {
		const playerListTMP = '{"joueurs":[{"nom":"Kevin Mw","score":"420" },{"nom":"JM Deschamps","score":"1337"}]}';
		const Json = JSON.parse(playerListTMP);
		let controller = new CaromController("Kevin Mw",this.$route.query.type,Json);
		controller.sendCoupToServeur = this.sendCoup;
		//requestAnimationFrame(controller.gameLoop);
		controller.startGame();
		//carom.demarrerPartie(this.$route.query.type);
		//carom.controller.getCoups = this.getCoups;
		//carom.controller.getCueAngleFromRemote = null/*this.getCueAngeFromRemote*/;
	},
	methods:{
		...mapActions("coups", {sendCoup:"create"})
	},
	watch:{
		/*'getCoups':function(){
			carom.controller.
		}*/
	},
	computed:{
		...mapGetters("coups",{getCoups:"find"})
		/* ...mapGetters("partie",{getCueAngleFromRemote:""}) */
	}
}
</script>