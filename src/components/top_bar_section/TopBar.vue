<template>
  <div class="w-full bg-white border-b border-gray-200">
    <div class="flex items-center justify-between px-20 py-4">
      <!-- Hamburger Menu (Mobile Only) -->
      <button
        class="hamburger-btn"
        @click="$emit('toggle-sidebar')"
        aria-label="Toggle sidebar menu"
        aria-expanded="false">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 12H21M3 6H21M3 18H21"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>

      <!-- Title -->
      <span class="title-text text-4xl font-bold text-black">Help Center</span>

      <!-- Right: Logo Image -->
      <div class="flex items-center">
        <a href="https://1max.com" aria-label="Go to 1MAX.com">
          <img
            src="../../assets/images/1max_faq_logo.png"
            alt="1MAX Logo"
            class="logo-img" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
  defineEmits(["toggle-sidebar"]);
</script>

<style scoped>
  div {
    font-family: "HarmonyOS_Sans", sans-serif;
  }

  .hamburger-btn {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    color: #000000;
    transition: color 0.3s ease;
  }

  .hamburger-btn:hover {
    color: #6842ff;
  }

  .hamburger-btn:focus {
    outline: 2px solid #6842ff;
    outline-offset: 2px;
  }

  @media (max-width: 767px) {
    .hamburger-btn {
      display: block;
      padding: 0.5rem 0;
      margin-right: 0.75rem;
    }

    .title-text {
      font-size: 1.5rem;
      position: absolute;
      left: 3.5rem;
    }

    .flex.items-center.justify-between {
      padding-left: 1rem;
      padding-right: 1rem;
      position: relative;
    }
  }

  /* Logo sizing */
  .logo-img {
    height: 48px;
    display: block;
  }

  @media (max-width: 500px) {
    .logo-img {
      height: 36px;
    }
  }
</style>
