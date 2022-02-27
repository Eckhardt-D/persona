<template>
  <main>
    <div class="form-section">
      <v-avatar size="80">
        <v-img :src="user.profileImage || '/avatar.jpg'" />
      </v-avatar>
      <section class="ml-7">
        <h1 class="profile-name">{{ user.name }}</h1>
        <a href="#" class="profile-website">{{
          user.website || `https://github.com/${user.username}`
        }}</a>
      </section>
    </div>
    <div class="form-section--noflex mt-7">
      <h3>Your story</h3>
      <p v-if="user.bio" class="profile-bio" v-html="$md(user.bio)" />
      <p v-else></p>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'FormDefault',
  computed: {
    ...mapState('user', ['user']),
  },
})
</script>
