<template>
  <div class="app-root">
    <app-header></app-header>
    
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component"></component>
      </transition>
    </router-view>

    <player></player>
    <!-- Auth Modal -->
    <app-auth></app-auth>
  </div>
</template>
<script>
import AppHeader from '@/components/AppHeader.vue';
import Player from '@/components/Player.vue';
import AppAuth from './components/AppAuth.vue';
import { mapWritableState } from 'pinia';
import useUserStore from '@/stores/user';
import { auth } from './includes/firebase';

export default {
  name: 'App',
  components: {
    AppHeader,
    Player,
    AppAuth,
  },
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn'])
  },
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true;
    }
  }
};
</script>
<style>
.app-root {
  width: 100vw;
}
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.25s linear;
}
.fade-leave-to {
  transition: all 0.25s linear;
  opacity: 0;
}
</style>
