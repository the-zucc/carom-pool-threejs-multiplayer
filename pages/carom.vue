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
		console.log("utilisateur:");
		console.log(partie)
		console.log(this.utilisateurCourant)
		if(partie.joueurs[0] == undefined){
			let nomUser = this.utilisateurCourant.name;
			console.log(this.utilisateurCourant);
			let joueurAjoute = {nom:nomUser,score:0, coup:{}};
			let objetPartie = {joueurs:[joueurAjoute, undefined]};
			this.updatePartie([partie._id, objetPartie]).then(()=>{
				console.log("updated PARTIE")
				console.log(this.parties({query:{_id:partieId}}).data[0].joueurs);
				console.log(this.parties({query:{_id:partieId}}).data[0].joueurs[0].nom);
				let controller = new CaromController(this.utilisateurCourant.name,partie,Json);
				controller.sendCoupToServeur = (coup, nomJoueur)=>this.updateCoup(coup, nomJoueur);
				controller.changerTourNiveauServeur = this.changerTour;
				controller.startGame();
				controller.getCoups = ()=>{return this.getCoups().data;}
				controller.startGame();
			});
		}
		else if(partie.joueurs[1] == undefined){
			let nomUser = this.utilisateurCourant.name;
			let joueurAjoute = {nom:nomUser,score:0, coup:{}};
			let objetPartie = {joueurs:[partie.joueurs[0], joueurAjoute]};
			this.updatePartie([partie._id, objetPartie]).then(()=>{
				console.log("updated PARTIE")
				console.log(this.parties({query:{_id:partieId}}).data[0].joueurs);
				console.log(this.parties({query:{_id:partieId}}).data[0].joueurs[0].nom);
				let controller = new CaromController(this.utilisateurCourant.name,partie,Json);
				//controller.sendCoupToServeur = this.sendCoup.bind(this);
				controller.sendCoupToServeur = (coup, nomJoueur)=>this.updateCoup(coup, nomJoueur);
				controller.changerTourNiveauServeur = this.changerTour;
				controller.startGame();
			});
		}
		else{
			alert("La partie est pleine");
		}
	},
	methods:{
		...mapActions("coups", {sendCoup:"create"}),
		...mapActions("parties", {getPartie:"find", updatePartie:"patch"}),
		updateCoup(coup, nomJoueur){
			let partieId = this.$route.query.partie;
			let partie = this.parties({query:{_id:partieId}}).data[0];
			let joueursActuels = partie.joueurs;
			let objetPartie = {};
			if(joueursActuels[0].nom == nomJoueur){
				let joueurMisAJour = joueursActuels[0];
				joueurMisAJour.coup = coup;
				objetPartie = {joueurs:[joueurMisAJour, joueursActuels[1]]}
			}else{
				let joueurMisAJour = joueursActuels[1];
				joueurMisAJour.coup = coup;
				objetPartie = {joueurs:[joueursActuels[0], joueurMisAJour]};
			}
			this.updatePartie([partie._id, objetPartie]);
		},
		changerTour(){
			let partieId = this.$route.query.partie;
			let partie = this.parties({query:{_id:partieId}}).data[0];
			let idx = partie.joueurCourant;
			let objetPartie = {joueurCourant:idx==0?1:0};
			this.updatePartie([partie.id, objetPartie]);
		}
	},
	watch:{

	},
	computed:{
		/* this.utilisateurCourant = app.service("users/current"); */
		...mapGetters("users", {utilisateurCourant:"current"}),
		...mapGetters("coups",{getCoups:"find"}),
		...mapGetters("parties",{parties:"find"})
		/* ...mapGetters("partie",{getCueAngleFromRemote:""}) */
	}
}
</script>