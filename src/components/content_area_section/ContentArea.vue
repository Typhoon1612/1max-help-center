<template>
  <main class="content-area">
    <BreadcrumpNav :selected-category="selectedCategory" />

    <!-- Show category content for all selected categories -->
    <div
      v-if="selectedCategory"
      class="content-container">
      <CategoryContent :category="selectedCategory" />
    </div>

    <!-- Default: Show sample accordions when no category is selected -->
    <div
      v-else
      class="accordion-container">
      <Accordion
        title="Registration & Login"
        :questions="[
          'How to Register an Account',
          'How to Reset Your Password',
          'How to Log In Using QR Code on Bybit',
          'How to Simultaneously Log in to Multiple Accounts',
        ]"
        :default-open="true" />

      <Accordion
        title="Account Settings"
        :questions="[
          'How to Change Account Email',
          'How to Enable Two-Factor Authentication',
          'How to Update Profile Information',
        ]" />

      <Accordion
        title="Security"
        :questions="[
          'How to Secure Your Account',
          'What is Two-Factor Authentication (2FA)?',
          'How to Recover Your Account',
        ]" />
    </div>
  </main>
</template>

<script setup>
  import { defineProps } from "vue";
  import BreadcrumpNav from "./sub-components/BreadcrumpNav.vue";
  import Accordion from "./sub-components/Accordion.vue";
  import CategoryContent from "./CategoryContent.vue";

  defineProps({
    selectedCategory: {
      type: Object,
      default: null,
    },
  });
</script>

<style scoped>
  .content-container,
  .accordion-container {
    margin-top: 1.5rem;
  }
</style>
