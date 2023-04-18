import { Howl } from 'howler';
import { defineStore } from "pinia"
import helper from '@/includes/helper';

export default defineStore('player', {
  state: () => ({
    current_song: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    progressPercent: '0%',
  }),
  actions: {
    async newSong(song) {
      if (this.sound instanceof Howl) {
        this.sound.unload()
      }
      this.current_song = song
      this.sound = new Howl({
        src: [song.url],
        html5: true,
      });

      this.sound.play()
      this.sound.on('play', () => {
        requestAnimationFrame(this.progress)
      })
    },
    progress() {
      const seek = this.sound.seek()
      const duration = this.sound.duration()
      this.seek = helper.formatTime(seek);
      this.duration = helper.formatTime(duration);
      this.progressPercent = `${(seek / duration) * 100}%`
      if (this.sound.playing()) {
        requestAnimationFrame(this.progress)
      }
    },
    async toggleAudio() {
      if (!this.sound.playing) {
        // 判断playing函数是否存在，即说明是否存在howler对象
        return
      }

      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play()
      }
    },
    // 点击进度条
    updateSeek(event) {
      // 传入指针点击事件
      if (!this.sound.playing) {
        return
      }
      console.log(event)
      const { x, width } = event.currentTarget.getBoundingClientRect()
      const clickX = event.x - x
      const percentage = clickX / width
      const seconds = this.sound.duration() * percentage;
      this.sound.seek(seconds)
      this.sound.once('seek', () => {
        requestAnimationFrame(this.progress)
      })
    },
  },
  getters: {
    playing: (state) => {
      // return Boolean
      if (state.sound.playing) {
        return state.sound.playing()
      } else {
        return false
      }
    }
  }
})