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
          :rules="[...rules.url]"
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
        :loading="loadingUpdate"
        @click="updateDetails"
        >Save</v-btn
      >
      <v-btn outlined small @click="cancelEdit">Cancel</v-btn>
    </v-card-actions>
    <v-notify v-model="error" :text="errorMessage" />
    <v-notify v-model="success" :text="successMessage" />
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapMutations, mapActions } from 'vuex'
import { Profile } from '../store/profile'
import { Avatar } from '../store/avatar'

export default Vue.extend({
  name: 'EditForm',
  data: () => ({
    preview: false,
    valid: true,
    error: false,
    success: false,
    errorMessage: '',
    successMessage: '',
    loadingUpdate: false,
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
        url: [(v: string) => !v || isUrl(v) || 'Value must be a valid URL'],
      }
    },
    processedBio() {
      const profile = this.profile as Profile
      const mark = (this as any).$md
      return mark(profile.bio || '')
    },
  },
  watch: {
    error(val) {
      const self = this
      if (val) {
        setTimeout(() => {
          self.error = false
          self.errorMessage = ''
        }, 3000)
      }
    },
    success(val) {
      const self = this
      if (val) {
        setTimeout(() => {
          self.success = false
          self.successMessage = ''
        }, 3000)
      }
    },
  },
  methods: {
    ...mapMutations('avatar', ['SET_AVATAR_HOVERING', 'SET_AVATAR']),
    ...mapMutations('profile', ['UPDATE_PROFILE', 'RESET_PROFILE']),
    ...mapActions('profile', ['resetProfile']),
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

      if (!files || !files[0]) return

      const file = files[0]
      const size = file.size
      const type = file.type

      if (size > 512000) {
        this.error = true
        this.errorMessage = 'Image must not be more than 512kb.'
        return
      }

      if (!type.includes('image/')) {
        this.error = true
        this.errorMessage = 'Image must be a valid image.'
        return
      }

      this.avatar = file
    },
    updateProfile({ key, value }: { key: string; value: string }) {
      this.profile = { key, value }
    },
    cancelEdit() {
      const reset = (this as any).resetProfile
      this.avatar = null
      reset()
      this.$emit('cancel')
    },
    async updateDetails() {
      let uploadUrl: string

      if (!this.valid) {
        this.error = true
        this.errorMessage = 'Please check that you have entered all the fields'
        return
      }

      this.loadingUpdate = true

      if ((this.avatar as Avatar).file) {
        // Upload and get link
        const url = `${this.$config.api_url}/api/profile/image`
        const formData = new FormData()

        formData.append('file', (this.avatar as Avatar).file as File)

        const response = await fetch(url, {
          method: 'POST',
          body: formData,
        }).then((res) => res.json())

        if (response.url) {
          uploadUrl = response.url
        }
      }

      const payload = (this as any).stripNullOrEmpty(this.profile)

      // @ts-ignore:TS2454
      if (uploadUrl) {
        payload.profileImage = uploadUrl
      }

      const id = this.user.id

      await this.$store.dispatch('profile/updateProfile', [
        this.$config.api_url,
        {
          id,
          update: payload,
        },
      ])

      this.loadingUpdate = false
      this.avatar = null
      this.success = true
      this.successMessage = 'Successfully updated 🚀'

      setTimeout(() => {
        this.$emit('cancel')
      }, 1000)
    },
    stripNullOrEmpty(profile: Profile) {
      const copy = { ...profile }
      const reduced = Object.entries(copy).reduce((previous, current) => {
        const [key, value] = current

        if (value) {
          return {
            ...previous,
            [key]: value,
          }
        }

        return previous
      }, {})

      return reduced
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
