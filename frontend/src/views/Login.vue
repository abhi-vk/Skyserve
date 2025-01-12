<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h2 class="text-center mb-4">Login</h2>
          <form @submit.prevent="validateForm" class="p-4 border rounded">
            
            <!-- Email Field -->
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="input.email"
                  :class="{'is-invalid': errors.email}"
                  placeholder="Enter your email"
                />
                <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
              </div>
            </div>
  
            <!-- Password Field -->
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-lock"></i>
                </span>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="input.password"
                  :class="{'is-invalid': errors.password}"
                  placeholder="Enter your password"
                />
                <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
              </div>
            </div>
  
            <!-- Submit Button -->
            <div class="d-grid">
              <button type="submit" class="btn btn-primary">
                Log In
              </button>
            </div>
          </form>
  
          <div class="text-center mt-3">
            <span>
              Don't have an account? <router-link to="/register">Register now</router-link>
            </span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router'; // Import useRouter for navigation
  import { userLoginApi } from '../apis/user.js';
  import { useToast } from 'vue-toastification'; // Import for toast notifications
  
  export default {
    setup() {
      const router = useRouter();  // Access Vue Router for navigation
      const toast = useToast();  // Initialize toast for notifications
      const input = ref({
        email: '',
        password: '',
      });
  
      const errors = ref({
        email: '',
        password: '',
      });
  
      const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };
  
      const validateForm = async () => {
        let isError = false;
        errors.value = { email: '', password: '' };
  
        Object.keys(input.value).forEach((key) => {
          const value = input.value[key];
          if (!value.trim()) {
            isError = true;
            errors.value[key] = 'This field is required';
          } else if (key === 'email' && !validateEmail(value)) {
            isError = true;
            errors.value[key] = 'Enter a valid email address';
          } else if (key === 'password' && value.trim().length < 6) {
            isError = true;
            errors.value[key] = 'Password must be at least 6 characters long';
          }
        });
  
        if (!isError) {
          const token = await userLoginApi(input.value, router);
          if (token) {
            toast.success('Login successful!');
            localStorage.setItem('authToken', token);
            router.push('/');  // Redirect to homepage after successful login
          }
        }
      };
  
      return {
        input,
        errors,
        validateForm,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add your scoped styles here */
  </style>
  