<template>
  <a
    href="https://1max.com"
    target="_blank"
    rel="noopener noreferrer"
    class="back-button">
    <svg
      class="arrow-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19 12H5M5 12L12 19M5 12L12 5"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round" />
    </svg>
    <span class="button-text">Back to 1MAX.com</span>
  </a>
</template>

<script setup>
  // BackButton component - Navigation link to return to 1MAX.com main site
</script>

<style scoped>
  .back-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    text-decoration: none;
    color: #000000;
    font-family: "HarmonyOS_Sans", sans-serif;
    font-size: 0.9375rem;
    font-weight: 500;
    transition: all 0.3s ease;
    border-radius: 0.5rem;
    cursor: pointer;
    position: relative;
  }

  .back-button::after {
    content: "";
    position: absolute;
    bottom: -0.75rem;
    left: 0;
    right: 0;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
  }

  .arrow-icon {
    transition: transform 0.3s ease;
  }

  .button-text {
    transition: color 0.3s ease;
  }

  /* Hover state */
  .back-button:hover {
    background-color: #6842ff;
    color: #ffffff;
    box-shadow:
      0 4px 6px -1px rgba(104, 66, 255, 0.3),
      0 2px 4px -1px rgba(104, 66, 255, 0.2);
  }

  .back-button:hover .arrow-icon {
    transform: translateX(-2px);
  }

  /* Active/Focus state */
  .back-button:active {
    transform: scale(0.98);
  }

  .back-button:focus {
    outline: 2px solid #6842ff;
    outline-offset: 2px;
  }
</style>
