<template>
  <form>
    <v-text-field
      label="Nom d'utilisateur"
      v-model="name"
      :error-messages="nameErrors"
      :counter="10"
      @input="$v.name.$touch()"
      @blur="$v.name.$touch()"
      required
    ></v-text-field>
    <v-text-field
      label="Adresse courriel"
      v-model="email"
      :error-messages="emailErrors"
      @input="$v.email.$touch()"
      @blur="$v.email.$touch()"
      required
    ></v-text-field>
    <v-select
      label="Thème désiré"
      v-model="select"
      :items="items"
      :error-messages="selectErrors"
      @change="$v.select.$touch()"
      @blur="$v.select.$touch()"
      required
    ></v-select>
    <v-checkbox
      label="J'accepte les conditions d'utilisation"
      v-model="checkbox"
      :error-messages="checkboxErrors"
      @change="$v.checkbox.$touch()"
      @blur="$v.checkbox.$touch()"
      required
    ></v-checkbox>

    <v-btn @click="submit">submit</v-btn>
    <v-btn @click="clear">clear</v-btn>
  </form>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required, maxLength, email } from 'vuelidate/lib/validators'
  export default {
    mixins: [validationMixin],
    validations: {
      name: { required, maxLength: maxLength(10) },
      email: { required, email },
      select: { required },
      checkbox: { required }
    },
    data: () => ({
      name: '',
      email: '',
      select: null,
      items: [
        'lumineux',
		'sombre'
      ],
      checkbox: false
    }),
    computed: {
      checkboxErrors () {
        const errors = []
        if (!this.$v.checkbox.$dirty) return errors
        !this.$v.checkbox.required && errors.push('Vous devez accepter les conditions d\'utilisation pour continuer.')
        return errors
      },
      selectErrors () {
        const errors = []
        if (!this.$v.select.$dirty) return errors
        !this.$v.select.required && errors.push('Il est nécessaire de choisir un thème')
        return errors
      },
      nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.maxLength && errors.push('La longueur maximale du nom d\'utilisateur est de 10 caractères')
        !this.$v.name.required && errors.push('Veuillez entrer un nom.')
        return errors
      },
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('Veuillez entrer une addresse courriel valide.')
        !this.$v.email.required && errors.push('Une adresse courriel est requise.')
        return errors
      }
    },
    methods: {
      submit () {
        this.$v.$touch()
      },
      clear () {
        this.$v.$reset()
        this.name = ''
        this.email = ''
        this.select = null
        this.checkbox = false
      }
    }
  }
</script>