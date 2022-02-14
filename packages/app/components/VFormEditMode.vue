<template>
  <main>
    <h1 class="mb-7">Edit Mode</h1>

    <div class="form-section">
      <v-avatar ref="avatar" style="align-self: flex-start;" size="80">
        <v-img :src="options.avatar.imageUrl" @mouseenter="showUploadState" @mouseleave="hideUploadState">
          <transition name="fade">
            <div v-if="options.avatar.isHovering" class="upload-overlay">
              <input id="uploader" type="file" accept="image/jpeg, image/png" @change="setAvatarUrl">
              <v-icon>mdi-camera-outline</v-icon>
            </div>
          </transition>
        </v-img>
      </v-avatar>
      <section class="ml-7">
        <v-text-field v-model="options.name" outlined dense label="Edit your name" value="John Doe" />
        <v-text-field v-model="options.website" outlined dense label="Edit your website link"></v-text-field>
      </section>
    </div>
    <div class="form-section--noflex mt-5">
      <h3 class="mb-2">Your story</h3>
      <v-textarea v-model="options.bio" outlined label="Edit your bio"/>
    </div>
  </main>
</template>

<script lang="ts">
// @TODO: Refactor to store Form module.
import Vue from 'vue'

export interface Avatar {
  isHovering: boolean;
  hasFile: boolean;
  file?: File | null;
  imageUrl: string;
}

export interface FormOptions {
  avatar: Avatar;
  bio: string;
  name: string;
  website: string;
}

export default Vue.extend({
  name: 'FormEdit',
  data: () => ({
    originalSettings: {
      avatar: {
        isHovering: false,
        hasFile: false,
        file: null,
        imageUrl: '/avatar.jpg'
      } as Avatar
    },
    options: {
      avatar: {
        isHovering: false,
        hasFile: false,
        file: null,
        imageUrl: '/avatar.jpg'
      } as Avatar,
      bio: 'An outstanding developer, focusing on Lua.',
      name: 'John Doe-San',
      website: 'https://yoursite.com'
    } as FormOptions
  }),
  computed: {
    avatarSource: {
      get() {
        return this.options.avatar.imageUrl
      },
      set(value: Event) {
        const files: FileList = (value.target as HTMLInputElement).files;

        if (files && files[0]) {
          const file = files[0]
          const url: string = URL.createObjectURL(file);
          
          this.options.avatar.hasFile = true;
          this.options.avatar.file = file;
          this.options.avatar.imageUrl = url;
          return;
        }

        this.options.avatar.hasFile = false;
        this.options.avatar.file = null;
        this.options.avatar.imageUrl = '/avatar.jpg'
      }
    }
  },
  methods: {
    showUploadState() {
      this.options.avatar.isHovering = true
    },
    hideUploadState() {
      this.options.avatar.isHovering = false
    },
    setAvatarUrl(payload: Event) {
      this.avatarSource = payload
    },
    resetForm() {
      this.options.avatar = this.originalSettings.avatar
    }
  }
})
</script>

<style>
.upload-overlay {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
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