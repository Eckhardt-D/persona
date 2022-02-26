<template>
  <v-app>
    <v-app-bar elevation="0" fixed app class="px-10">
      <v-app-bar-title> Persona </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn text color="error" @click="logout">logout</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer absolute app>
      <span id="footerText">
        &copy; {{ new Date().getFullYear() }} Made with 💓 in Namibia ☀️
      </span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import * as Cookie from 'js-cookie'

export default Vue.extend({
  name: 'DefaultLayout',
  methods: {
    logout() {
      Cookie.remove('persona_token')
      location.assign('/auth')
    },
  },
})
</script>

<style>
#footerText {
  font-size: 0.75rem;
  padding: 0.4rem;
}
</style>
