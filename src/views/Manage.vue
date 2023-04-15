<template>
  <div>
    <section class="container mx-auto mt-6">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
          <upload ref="upload" :addSong="addSong"/>

        </div>
        <div class="col-span-2">
          <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
              <span class="card-title">My Songs</span>
              <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
            </div>
            <div class="p-6">
              <!-- Composition Items -->
              <composition-itme v-for="(song, i) in songs" :key="song.docID" :song="song" 
              :index="i" :updateSong="updateSong" :removeSong="removeSong"></composition-itme>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Upload from '../components/Upload.vue';
import CompositionItme from '../components/CompositionItme.vue';
import { songsCollection, auth } from '@/includes/firebase'
export default {
  name: 'Manage',
  components: {
    Upload,
    CompositionItme,
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    }
  },
  beforeRouteLeave(to, from, next) {
    console.log('boforeRouterEnter Guard')
    this.$refs.upload.cancelUpload();
    next();
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name
      this.songs[i].genre = values.genre
    },
    removeSong (i) {
      this.songs.splice(i, 1)
    },
    addSong(document) {
      // 参数是一个DocumentSnapshot(需要调用data方法)。作用是将参数中的信息解构成新对象，添加到歌曲数组。
      const song = {
        ...document.data(),
        docID: document.id,
      }
      this.songs.push(song)
    },
  },
  async created() {
    const query = songsCollection.where('uid', '==', auth.currentUser.uid) // Query
    const snapshots = await query.get() // QuerySnapshot
    snapshots.forEach((document) => {
      // DocumentSnapshot
      this.addSong(document)
    })
  },
}
</script>

<style lang="scss" scoped></style>