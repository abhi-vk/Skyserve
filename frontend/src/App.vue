<template>
  <div>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAuthenticated: !!localStorage.getItem("token"), 
    };
  },
  watch: {
    isAuthenticated(newValue) {
      if (!newValue) {
        this.$router.push("/");
      }
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.isAuthenticated = false;
    },
  },
};
</script>

<style>


</style>
