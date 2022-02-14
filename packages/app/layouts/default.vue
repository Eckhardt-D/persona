<template>
  <v-app>
    <v-app-bar elevation="0" fixed app class="px-10">
      <v-app-bar-title> Persona </v-app-bar-title>
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

<script>
export default {
  name: 'DefaultLayout',
}
</script>

<style>
#footerText {
  font-size: 0.75rem;
  padding: 0.4rem;
}
</style>
