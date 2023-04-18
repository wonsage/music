<template>
  <div>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none" @click.prevent="newSong(song)"
        >
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">Comments ({{song.comment_count}})</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
        <div class="text-white text-center font-bold p-4 mb-4" :class="comment_alert_variant" v-show="comment_show_alert">
        {{ comment_alert_message }}
        </div>
          <vee-form v-if="userLoggedIn" :validation-schema="schema" @submit="addComment">
            <vee-field as="textarea" name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <ErrorMessage class=" text-red-600" name="comment"></ErrorMessage>
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="comment_in_sumission"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded" v-model="sort"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li class="p-6 bg-gray-50 border border-gray-200" v-for="comment in sortedComments" :key="comment.docID">
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted}}</time>
        </div>

        <p>
          {{ comment.content}}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import { auth, songsCollection, commentsCollection } from '@/includes/firebase'
import {mapState, mapActions} from 'pinia'
import useUserStore from '@/stores/user'
import usePlayerStore from '@/stores/player'

export default {
  name: 'Song',
  data() {
    return {
      song: {},
      comments: [],
      schema: {
        comment: 'required|min:3',
      },
      comment_in_sumission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_message: 'Please wait! Your comment is being submitted.',
      sort: '1',
    }
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    sortedComments() {
      return this.comments.slice().sort((a,b) => {
        if (this.sort === '1') { // 最新排序
          return new Date(b.datePosted) - new Date(a.datePosted)
        } else { // 最早排序
          return new Date(a.datePosted) - new Date(b.datePosted)
        }
      })
    }
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return
      }
      this.$router.push({
        query: {
          sort: newVal,
        }
      })
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ['newSong']),
    async getComments () {
      const snapshots = await commentsCollection.where('sid', '==', this.$route.params.id).get()
      this.comments = []
      snapshots.forEach(doc => {
        this.comments.push({
          docID: doc.id,
          ...doc.data(),
        })
      });
    },
    async addComment(values, { resetForm}) {
      // 界面提示开始
      this.comment_in_sumission = true;
      this.comment_show_alert = true
this.comment_alert_variant='bg-blue-500'
      this.comment_alert_message= 'Please wait! Your comment is being submitted.'
      // 组织数据对象
      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      }
      // 调用数据库API
      await commentsCollection.add(comment)
      resetForm();
      this.song.comment_count += 1
      await songsCollection.doc(this.$route.params.id).update({
        comment_count: this.song.comment_count,
      })
      this.getComments()
      // 界面提示成功
      this.comment_in_sumission = false
      this.comment_alert_message = 'Comment added'
      this.comment_alert_variant = 'bg-green-500'
      setTimeout(() => {
        this.comment_show_alert = false
      }, 2000)
    },
  },
  async created () {
    const docSnapshot = await songsCollection.doc(this.$route.params.id).get()
    if (!docSnapshot.exists) {
      this.$router.push({name: 'home'})
      return
    }
    const { sort } = this.$route.query;
    this.sort = sort === '2' ? sort : '1'; // 从查询参数中取值，默认为1
    this.song = docSnapshot.data()
    this.getComments();
  }
}
</script>

<style>

</style>