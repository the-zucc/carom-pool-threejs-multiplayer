<template>
	<v-layout>
		<v-flex id="carom-container"></v-flex>
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