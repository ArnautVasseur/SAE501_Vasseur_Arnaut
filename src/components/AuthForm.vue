<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="registerUser">
      <label for="email">Email:</label>
      <input type="email" v-model="email" required />

      <label for="password">Password:</label>
      <input type="password" v-model="password" required />

      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    registerUser() {
      // Send a POST request to your server
      this.$axios.post('http://localhost:5173/register', {
        email: this.email,
        password: this.password,
      })
      .then(response => {
        console.log(response.data);
        // Handle success, e.g., show a success message
      })
      .catch(error => {
        console.error(error.response.data);
        // Handle error, e.g., show an error message to the user
      });
    },
  },
};
</script>
