<template>
  <v-form v-model="valid">
    <h1 class="mb-7">Edit Mode</h1>

    <div class="form-section">
      <v-avatar ref="avatar" style="align-self: flex-start" size="80">
        <v-img
          :src="avatar.localUrl || profileState.profileImage"
          @mouseenter="showUploadState"
          @mouseleave="hideUploadState"
        >
          <transition name="fade">
            <div v-if="avatarState.isHovering" class="upload-overlay">
              <input
                id="uploader"
                type="file"
                accept="image/jpeg, image/png"
                @change="setAvatarUrl"
              />
              <v-icon>mdi-camera-outline</v-icon>
            </div>
          </transition>
        </v-img>
      </v-avatar>
      <section class="ml-7">
        <v-text-field
          :value="profileState.name"
          :rules="rules.required"
          outlined
          dense
          label="Edit your name"
          @input="(value) => updateProfile({ key: 'name', value })"
        />
        <v-text-field
          :value="profileState.website"
          :rules="[...rules.required, ...rules.url]"
          outlined
          dense
          label="Edit your website link"
          @input="(value) => updateProfile({ key: 'website', value })"
        ></v-text-field>
      </section>
    </div>
    <div class="form-section--noflex mt-5">
      <h3 class="mb-2">Your story</h3>
      <div class="text-right">
        <v-btn text @click="preview = !preview"> Toggle preview </v-btn>
      </div>
      <v-textarea
        v-if="!preview"
        :value="profileState.bio"
        :rules="rules.required"
        outlined
        label="Edit your bio (markdown supported)"
        @input="(value) => updateProfile({ key: 'bio', value })"
      />
      <div
        v-else
        outlined
        disabled
        label="Preview mode"
        v-html="processedBio"
      />
    </div>
    <v-card-actions>
      <v-btn
        class="ml-auto"
        color="primary"
        outlined
        small
        @click="updateDetails"
        >Save</v-btn
      >
      <v-btn outlined small @click="cancelEdit">Cancel</v-btn>
    </v-card-actions>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapMutations } from 'vuex'
import { Profile } from '../store/profile'

export default Vue.extend({
  name: 'EditForm',
  data: () => ({
    preview: false,
    valid: true,
  }),
  computed: {
    ...mapState('user', ['user']),
    ...mapState('profile', { profileState: 'profile' }),
    ...mapState('avatar', { avatarState: 'avatar' }),
    profile: {
      get(): Profile {
        return this.profileState
      },
      set({ key, value }) {
        const updateProfile = (this as any).UPDATE_PROFILE
        updateProfile({ key, update: value })
      },
    },
    avatar: {
      get() {
        return this.avatarState
      },
      set(value: File) {
        const setAvatar = (this as any).SET_AVATAR
        setAvatar(value)
      },
    },
    rules() {
      const isUrl = (this as any).isUrl
      return {
        required: [(v: string) => !!v || 'Value is required'],
        url: [(v: string) => isUrl(v) || 'Value must be a valid URL'],
      }
    },
    processedBio() {
      const profile = this.profile as Profile
      const mark = (this as any).$md
      return mark(profile.bio || '')
    },
  },
  methods: {
    ...mapMutations('avatar', ['SET_AVATAR_HOVERING', 'SET_AVATAR']),
    ...mapMutations('profile', ['UPDATE_PROFILE']),
    isUrl(input: string): boolean {
      try {
        const url = new URL(input)
        return !!url
      } catch (__) {
        return false
      }
    },
    showUploadState() {
      const setAvatarHovering = (this as any).SET_AVATAR_HOVERING
      setAvatarHovering(true)
    },
    hideUploadState() {
      const setAvatarHovering = (this as any).SET_AVATAR_HOVERING
      setAvatarHovering(false)
    },
    setAvatarUrl(value: Event) {
      const target = value.target as HTMLInputElement
      const files = target.files

      if (files && files[0]) {
        const file = files[0]
        this.avatar = file
      }
    },
    updateProfile({ key, value }: { key: string; value: string }) {
      this.profile = { key, value }
    },
    cancelEdit() {
      this.avatar = null
      // @todo reset profile data to user data.
      this.$emit('cancel')
    },
    updateDetails() {
      console.log(this.profile, this.avatar)
    },
  },
})
</script>

<style>
.upload-overlay {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.upload-overlay .v-icon {
  color: white;
}

.upload-overlay #uploader {
  opacity: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  cursor: pointer;
}

/* we will explain what these classes do next! */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
