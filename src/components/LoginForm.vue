<template>
  <div>
    <div class="text-white text-center font-bold p-4 rounded mb-4" v-if="login_show_alert" :class="login_alert_variant">
      {{ login_alert_msg }}
    </div>
    <vee-form :validation-schema="schema" @submit="login">
      <!-- Email -->
      <div class="mb-3">
        <label class="inline-block mb-2">Email</label>
        <vee-field type="email" name="email"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Email" />
        <ErrorMessage class="text-red-600" name="email"></ErrorMessage>
      </div>
      <!-- Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Password</label>
        <vee-field type="password" name="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password" />
        <ErrorMessage class="text-red-600" name="password"></ErrorMessage>
      </div>
      <button type="submit"
        class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700 disabled:bg-gray-300"
        :disabled="login_in_submission" @click.prevent="login">
        Submit
      </button>
    </vee-form>
  </div>
</template>

<script>
import { ErrorMessage } from 'vee-validate';

export default {
  name: 'RegisterForm',
  components: {
    ErrorMessage,
  },
  data() {
    return {
      schema: {
        email: 'required|email',
        password: 'required|min:9|max:30',
      },
      login_in_submission: false,
      login_show_alert: false,
      login_alert_variant: 'bg-blue-500',
      login_alert_msg: 'Please wait! We are logging you in.',
    }
  },
  methods: {
    async login(values) {
      console.log(values)
      this.login_show_alert = true
      this.login_in_submission = true
      this.login_alert_variant = 'bg-blue-500'
      this.login_alert_msg = 'Please wait! We are logging you in.'
      await new Promise(resolve => {
        setTimeout(resolve, 1500)
      })
      this.login_alert_variant = 'bg-green-500'
      this.login_alert_msg = 'Success! You are now logged in.'
    }
  }
}
</script>

<style scoped></style>