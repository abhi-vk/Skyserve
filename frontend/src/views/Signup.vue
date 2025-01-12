<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h2 class="text-center mb-4">Register</h2>
          <form @submit.prevent="validateForm" class="p-4 border rounded">
            
            <!-- Username Field -->
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="input.username"
                  :class="{'is-invalid': errors.username}"
                  placeholder="Enter a username"
                />
                <div v-if="errors.username" class="invalid-feedback">{{ errors.username }}</div>
              </div>
            </div>
  
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
  
            <!-- Confirm Password Field -->
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-lock-fill"></i>
                </span>
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="input.confirmPassword"
                  :class="{'is-invalid': errors.confirmPassword}"
                  placeholder="Confirm your password"
                />
                <div v-if="errors.confirmPassword" class="invalid-feedback">{{ errors.confirmPassword }}</div>
              </div>
            </div>
  
            <!-- Submit Button -->
            <div class="d-grid">
              <button type="submit" class="btn btn-primary">Sign Up</button>
            </div>
          </form>
  
          <!-- Link to login -->
          <div class="text-center mt-3">
            <span>Already have an account? <router-link to="/login">Login</router-link></span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router'; // Import useRouter
  import { userRegisterApi } from '../apis/user.js';
  import { useToast } from 'vue-toastification'; // Import for toast notifications
  
  export default {
    setup() {
      const router = useRouter();  // Use the useRouter hook
      const toast = useToast();  // Initialize toast
      const input = ref({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
  
      const errors = ref({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
  
      const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };
  
      const validateForm = async () => {
        let isError = false;
        errors.value = { username: '', email: '', password: '', confirmPassword: '' };
  
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
          } else if (key === 'confirmPassword' && value !== input.value.password) {
            isError = true;
            errors.value[key] = 'Passwords do not match';
          }
        });
  
        if (!isError) {
          const success = await userRegisterApi(input.value, router);  // Pass the router to the API function
          if (success) {
            toast.success('Registration successful! Please log in.');
            router.push('/login');
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
  