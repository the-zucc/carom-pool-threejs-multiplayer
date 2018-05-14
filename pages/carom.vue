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
		let partie = this.parties({query:{_id:partieId}}).data[0];
		//console.log(partie)
		if(partie.joueurs[0] == undefined){
			let joueurAjoute = {nom:"Kevin Mw",score:420};
			let objetPartie = {joueurs:[joueurAjoute, undefined]};
			this.updatePartie([partie._id, objetPartie]).then(()=>{
				console.log("updated PARTIE")
				console.log(this.parties({query:{_id:partieId}}).data[0].joueurs);
				console.log(this.parties({query:{_id:partieId}}).data[0].joueurs[0].nom);
				let controller = new CaromController("Kevin Mw",partie,Json);
				controller.sendCoupToServeur = this.sendCoup.bind(this);
				controller.getCoups = ()=>{return this.getCoups().data;}
				controller.startGame();
			});
		}
		else if(partie.joueurs[1] == undefined){
			let joueurAjoute = {nom:"JM Deschamps",score:420};
			let objetPartie = {joueurs:[partie.joueurs[0], joueurAjoute]};
			this.updatePartie([partie._id, objetPartie]).then(()=>{
				console.log("updated PARTIE")
				console.log(this.parties({query:{_id:partieId}}).data[0].joueurs);
				console.log(this.parties({query:{_id:partieId}}).data[0].joueurs[0].nom);
				let controller = new CaromController("Kevin Mw",partie,Json);
				controller.sendCoupToServeur = this.sendCoup.bind(this);
				controller.getCoups = ()=>{return this.getCoups().data;}
				controller.startGame();
			});
		}
		else{
			console.log("you dumb");
		}
	},
	methods:{
		...mapActions("users", {utilisateurCourant:"current"}),
		...mapActions("coups", {sendCoup:"create"}),
		...mapActions("parties", {getPartie:"find", updatePartie:"patch"})
	},
	watch:{
		parties (value){
			console.log("yo")
		}
	},
	computed:{
		...mapGetters("coups",{getCoups:"find"}),
		...mapGetters("parties",{parties:"find"})
		/* ...mapGetters("partie",{getCueAngleFromRemote:""}) */
	}
}
</script>