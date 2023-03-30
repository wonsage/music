<template>
  <div>
    <div class="text-white text-center font-bold p-4 rounded mb-4" v-if="reg_show_alert" :class="reg_alert_variant">
      {{ reg_alert_msg }}
    </div>
    <vee-form :validation-schema="schema" :initial-values="userData" @submit="register">

      <!-- Name -->
      <div class="mb-3">
        <label class="inline-block mb-2">Name</label>
        <vee-field name="name" type="text"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Name" />
        <ErrorMessage class="text-red-600" name="name" />
      </div>
      <!-- Email -->
      <div class="mb-3">
        <label class="inline-block mb-2">Email</label>
        <vee-field name="email" type="email"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Enter Email" />
        <ErrorMessage class="text-red-600" name="email"></ErrorMessage>
      </div>
      <!-- Age -->
      <div class="mb-3">
        <label class="inline-block mb-2">Age</label>
        <vee-field name="age" type="number"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded" />
        <ErrorMessage class="text-red-600" name="age"></ErrorMessage>

      </div>
      <!-- Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Password</label>
        <vee-field name="password" :bails="false" v-slot="{ field, errors }">
          <input type="password"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Password" v-bind="field" />
          <!-- <ErrorMessage class="text-red-600" name="password"></ErrorMessage> -->
          <div class="text-red-600" v-for="error in errors" :key="error">
            {{ error }}
          </div>
        </vee-field>


      </div>
      <!-- Confirm Password -->
      <div class="mb-3">
        <label class="inline-block mb-2">Confirm Password</label>
        <vee-field name="confirm_password" type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Confirm Password" />
        <ErrorMessage class="text-red-600" name="confirm_password"></ErrorMessage>

      </div>
      <!-- Country -->
      <div class="mb-3">
        <label class="inline-block mb-2">Country</label>
        <vee-field as="select" name="country"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded">
          <option value="USA">USA</option>
          <option value="Mexico">Mexico</option>
          <option value="Germany">Germany</option>
          <option value="China">China</option>
        </vee-field>
        <ErrorMessage class="text-red-600" name="country"></ErrorMessage>

      </div>
      <!-- TOS -->
      <div class="mb-3 pl-6">

        <label class="inline-block"><vee-field name="tos" type="checkbox" value="1"
            class="w-4 h-4 float-left -ml-6 mt-1 rounded" />Accept terms of service</label>
      </div>
      <ErrorMessage class="text-red-600" name="tos"></ErrorMessage>
      <button type="submit"
        class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700 disabled:bg-gray-300"
        :disabled="reg_in_submission">
        Submit
      </button>
    </vee-form>
  </div>
</template>

<script>
import { ErrorMessage } from 'vee-validate';
import { mapActions } from 'pinia';
import useUserStore from '@/stores/user';

export default {
  name: 'RegisterForm',
  components: {
    ErrorMessage,
  },
  data() {
    return {
      schema: {
        name: "required|min:3|max:100|alpha_spaces",
        email: "required|email",
        age: "required|min_value:18|max_value:90",
        password: "required|min:9|max:30|excluded:password",
        confirm_password: "psw_mismatch:@password",
        country: "required|country_excluded:China",
        tos: "tos",
      },
      userData: {
        country: 'USA',
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_msg: 'Please wait! Your account is being created.',
    }
  },
  computed: {
  },
  methods: {
    ...mapActions(useUserStore, {
      createUser: 'register',
    }),
    async register(values) {
      // console.log(values)
      this.reg_show_alert = true
      this.reg_in_submission = true
      this.reg_alert_variant = 'bg-blue-500'
      this.reg_alert_msg = 'Please wait! Your account is being created.'

      try {
        this.createUser(values);
      } catch (error) {
        this.reg_in_submission = false;
        this.reg_alert_variant = 'bg-red-500'
        this.reg_alert_msg = 'An unexpected error occured. Please try again later.';
        console.log('auth error', error)
        return;
      }

      this.reg_alert_variant = 'bg-green-500'
      this.reg_alert_msg = 'Congratulations! Your Account has been created.';
      window.location.reload();
    },

  }
}
</script>

<style scoped></style>