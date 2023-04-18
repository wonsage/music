<template>
  <div>
    <div class="border border-gray-200 p-3 mb-4 rounded">
      <div v-show="!showForm" class="overflow-hidden">
        <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
        <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right" @click.prevent="deleteSong">
          <i class="fa fa-times"></i>
        </button>
        <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right" @click="showForm = !showForm">
          <i class="fa fa-pencil-alt"></i>
        </button>
      </div>
      <div v-show="showForm">
        <div class="text-white text-center font-bold p-4 mb-4" :class="alert_variant" v-if="show_alert">{{ alert_message
        }}</div>
        <vee-form :validation-schema="schema" :initial-values="song" @submit="submitEdition">
          <div class="mb-3">
            <label class="inline-block mb-2">Song Title</label>
            <vee-field name="modified_name" type="text"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
              :value="song.modified_name" placeholder="Enter Song Title" />
            <ErrorMessage class="text-red-600" name="modified_name"></ErrorMessage>
          </div>
          <div class="mb-3">
            <label class="inline-block mb-2">Genre</label>
            <vee-field name="genre" type="text"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
              :value="song.genre" placeholder="Enter Genre" />
            <ErrorMessage class="text-red-600" name="genre"></ErrorMessage>
          </div>
          <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600" :disabled="in_submission">
            Submit
          </button>
          <button type="button" class="py-1.5 px-3 rounded text-white bg-gray-600" :disabled="in_submission"
            @click.prevent="showForm = !showForm">
            Go Back
          </button>
        </vee-form>
      </div>
    </div>
  </div>
</template>

<script>
import { ErrorMessage } from 'vee-validate';
import { songsCollection, storage, auth } from '@/includes/firebase'


export default {
  name: 'CompositionItem',
  components: {
    ErrorMessage,
  },
  props: {
    song: {
      required: true,
      type: Object,
    },
    updateSong: {
      required: true,
      type: Function,
    },
    removeSong: {
      required: true,
      type: Function,
    },
    index: {
      required: true,
      type: Number,
    }
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: 'required',
        genre: 'alpha_spaces',
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait! Updating song info.',
    }
  },
  methods: {
    async submitEdition(values) {
      console.log(values)
      // step1: Change view to notice user submission process has been started.
      this.in_submission = true
      this.show_alert = true
      this.alert_variant = 'bg-blue-500'
      this.alert_message = 'Please wait! Updating song info.'
      // step2: Send the infomation to Firebase.
      try {
        await songsCollection.doc(this.song.docID).update(values)
        this.updateSong(this.index, values)
      } catch (error) {
        console.log(error)
        this.in_submission = false
        this.alert_variant = 'bg-red-500'
        this.alert_message = 'Something went wrong! Try again later.'
        return
      }
      this.in_submission = false
      this.alert_variant = 'bg-green-500'
      this.alert_message = 'Success!'
      setTimeout(() => {
        this.show_alert = false
      }, 2500)
    },
    async deleteSong () {
      // 在storage中删除文件
      const storageRef = storage.ref()
      const songRef = storageRef.child(`songs/${this.song.stored_name}`)
      await songRef.delete()

      // 在database中删除document
      await songsCollection.doc(this.song.docID).delete()

      // 在data的歌曲数组中删除
      this.removeSong(this.index)
    },
  }
}
</script>

<style lang="scss" scoped></style>