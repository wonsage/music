<template>
  <!-- Player -->
    <div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full">
      <!-- Track Info -->
      <div class="text-center" v-if="current_song.modified_name">
        <span class="song-title font-bold">{{current_song.modified_name}}</span> via
        <span class="song-artist">{{ current_song.display_name }}</span>
      </div>
      <div class="flex flex-nowrap gap-4 items-center">
        <!-- Play/Pause Button -->
        <button type="button" @click.prevent="toggleAudio">
          <i class="fa text-gray-500 text-xl" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
        </button>
        <!-- Current Position -->
        <div class="player-currenttime w-10">{{ seek }}</div>
        <!-- Scrub Container  -->
        <div class="w-full h-2 rounded bg-gray-200 relative cursor-pointer" @click.prevent="updateSeek">
          <!-- Player Ball -->
          <span class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg" :style="{left: progressPercent}">
            <i class="fas fa-circle"></i>
          </span>
          <!-- Player Progress Bar-->
          <span class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400" :style="{width: progressPercent}"></span>
        </div>
        <!-- Duration -->
        <div class="player-duration">{{duration}}</div>
      </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import usePlayerStore from '@/stores/player'

export default {
  name: 'Player',
  computed: {
    ...mapState(usePlayerStore, ['current_song', 'playing', 'seek', 'duration', 'progressPercent']),
  },
  methods: {
    ...mapActions(usePlayerStore, ['toggleAudio', 'updateSeek'])
  },
}
</script>

<style>

</style>