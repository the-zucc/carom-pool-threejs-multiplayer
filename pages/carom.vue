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
		let partieId = this.$route.query.partie;
		let partie = this.parties({query:{_id:partieId}});
		let controller = new CaromController("Kevin Mw",partie,Json);
		controller.sendCoupToServeur = this.sendCoup.bind(this);
		controller.getCoups = ()=>{return this.getCoups().data;}
		controller.startGame();
		//carom.demarrerPartie(this.$route.query.type);
		
		//carom.controller.getCueAngleFromRemote = null/*this.getCueAngeFromRemote*/;
	},
	methods:{
		...mapActions("coups", {sendCoup:"create"}),
		...mapActions("parties", {getPartie:"find"})
	},
	watch:{
		getCoups () {
			console.log(this.getCoups());
		}
	},
	computed:{
		...mapGetters("coups",{getCoups:"find"}),
		...mapGetters("parties",{parties:"find"})
		/* ...mapGetters("partie",{getCueAngleFromRemote:""}) */
	}
}
</script>