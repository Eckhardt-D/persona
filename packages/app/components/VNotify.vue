<template>
  <v-snackbar v-model="snackbar" dismissable>
    {{ text }}
    <template #action="{ attrs }">
      <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'VNotify',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  computed: {
    snackbar: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },
  },
})
</script>

<style></style>
