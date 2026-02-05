<template>
  <!-- Backdrop (mobile only) -->
  <transition name="fade">
    <div
      v-if="isOpen"
      class="sidebar-backdrop"
      @click="$emit('close-sidebar')"
      aria-hidden="true"></div>
  </transition>

  <!-- Sidebar -->
  <aside
    :class="['sidebar', { 'sidebar--open': isOpen }]"
    role="dialog"
    :aria-modal="isOpen ? 'true' : 'false'"
    aria-labelledby="sidebar-title"
    @keydown.esc="$emit('close-sidebar')">
    <div class="sidebar-header">
      <h2
        id="sidebar-title"
        class="sr-only">
        Help Center Navigation
      </h2>
      <button
        v-if="isOpen"
        class="close-btn"
        @click="$emit('close-sidebar')"
        aria-label="Close sidebar">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
    </div>
    <BackButton />
    <CategoryTitle @category-selected="handleCategorySelected" />
  </aside>
</template>

<script setup>
  import { watch } from "vue";
  import BackButton from "./BackButton.vue";
  import CategoryTitle from "./CategoryTitle.vue";

  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(["category-selected", "close-sidebar"]);

  const handleCategorySelected = (category) => {
    emit("category-selected", category);
    // Close sidebar on mobile after selection
    if (window.innerWidth <= 767) {
      emit("close-sidebar");
    }
  };

  // Disable body scroll when sidebar is open on mobile
  watch(
    () => props.isOpen,
    (newVal) => {
      if (window.innerWidth <= 767) {
        if (newVal) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
        }
      }
    },
  );
</script>

<style scoped>
  .sidebar {
    width: 250px;
    height: calc(100vh - 73px);
    background-color: #ffffff;
    border-right: 1px solid #e5e7eb;
    padding: 1.5rem 0;
    position: fixed;
    left: 0;
    top: 73px;
    overflow-y: auto;
    z-index: 40;
  }

  /* Scrollbar styling */
  .sidebar::-webkit-scrollbar {
    width: 6px;
  }

  .sidebar::-webkit-scrollbar-track {
    background: transparent;
  }

  .sidebar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  .sidebar::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }

  .sidebar-header {
    display: none;
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    color: #000000;
    transition: color 0.3s ease;
  }

  .close-btn:hover {
    color: #6842ff;
  }

  .close-btn:focus {
    outline: 2px solid #6842ff;
    outline-offset: 2px;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .sidebar-backdrop {
    display: none;
  }

  /* Responsive design */
  @media (max-width: 767px) {
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      width: 80%;
      max-width: 300px;
      height: 100vh;
      transform: translateX(-100%);
      transition: transform 0.28s ease;
      z-index: 1000;
      padding-top: 1rem;
    }

    .sidebar--open {
      transform: translateX(0);
    }

    .sidebar-backdrop {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 999;
    }

    .sidebar-header {
      display: flex;
      justify-content: flex-end;
      padding: 0 1rem 1rem 1rem;
    }

    .close-btn {
      display: block;
    }
  }

  /* Backdrop fade transition */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.28s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
