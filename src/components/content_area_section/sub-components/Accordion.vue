<template>
  <div class="accordion-item">
    <div
      class="accordion-header"
      @click="toggleAccordion">
      <span class="accordion-title">{{ title }}</span>
      <svg
        class="chevron-icon"
        :class="{ rotated: isOpen }"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 9L12 15L18 9"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
    </div>

    <transition name="accordion">
      <div
        v-show="isOpen"
        class="accordion-content">
        <div class="question-list">
          <div
            v-for="(question, index) in questions"
            :key="index"
            class="question-item">
            {{ question }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
  import { ref } from "vue";

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    questions: {
      type: Array,
      default: () => [],
    },
    defaultOpen: {
      type: Boolean,
      default: false,
    },
  });

  const isOpen = ref(props.defaultOpen);

  const toggleAccordion = () => {
    isOpen.value = !isOpen.value;
  };
</script>

<style scoped>
  .accordion-item {
    background-color: #ffffff;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .accordion-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    user-select: none;
  }

  .accordion-header:hover {
    background-color: #f9fafb;
  }

  .accordion-title {
    font-family: "HarmonyOS_Sans", sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: #000000;
  }

  .chevron-icon {
    color: #6b7280;
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }

  .chevron-icon.rotated {
    transform: rotate(180deg);
  }

  .accordion-content {
    overflow: hidden;
  }

  .question-list {
    padding: 0 1.5rem 1.5rem 1.5rem;
  }

  .question-item {
    font-family: "HarmonyOS_Sans", sans-serif;
    font-size: 0.9375rem;
    color: #374151;
    padding: 0.75rem 0;
    cursor: pointer;
    transition: color 0.3s ease;
    border-bottom: 1px solid #f3f4f6;
  }

  .question-item:last-child {
    border-bottom: none;
  }

  .question-item:hover {
    color: #6842ff;
  }

  /* Accordion transition */
  .accordion-enter-active,
  .accordion-leave-active {
    transition: all 0.3s ease;
    max-height: 500px;
  }

  .accordion-enter-from,
  .accordion-leave-to {
    max-height: 0;
    opacity: 0;
  }
</style>
