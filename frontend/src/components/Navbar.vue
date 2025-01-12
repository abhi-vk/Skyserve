<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <i class="bi bi-calendar3"></i> Geospace Data application
      </router-link>

      <div class="ml-auto">
        <template v-if="loading">
          <span class="navbar-text">Loading...</span>
        </template>

        <template v-else>
          <template v-if="user">
            <span class="navbar-text me-3">Hello, {{ user.username }}</span>
            <button class="btn btn-outline-light" @click="handleLogout">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-outline-light me-2">Sign In</router-link>
            <router-link to="/register" class="btn btn-outline-light">Register</router-link>
          </template>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { userDashboardApi } from '../apis/user.js';

export default {
  setup() {
    const user = ref(null);
    const loading = ref(true);
    const router = useRouter();
    const toast = useToast();

    const fetchUserData = async () => {
      try {
        const userData = await userDashboardApi(router);
        if (userData) {
          user.value = userData;
        }
      } catch (error) {
        toast.error('Failed to fetch user data');
      } finally {
        loading.value = false;
      }
    };

    const handleLogout = () => {
      localStorage.removeItem('authToken');
      toast.success('Logged out successfully.');
      user.value = null;
      router.push('/login');
    };

    onMounted(() => {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        fetchUserData();
      } else {
        loading.value = false;
      }
    });

    return {
      user,
      loading,
      handleLogout,
    };
  },
};
</script>

<style scoped>
/* Add any scoped styles here if needed */
</style>
