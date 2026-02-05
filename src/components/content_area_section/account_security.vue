<template>
  <div class="account-security-container">
    <div
      v-if="loading"
      class="loading-state">
      <p>Loading...</p>
    </div>

    <div
      v-else-if="error"
      class="error-state">
      <p>Error loading data: {{ error }}</p>
    </div>

    <div
      v-else
      class="accordion-list">
      <div
        v-for="(faq, index) in faqs"
        :key="faq.id"
        class="accordion-wrapper">
        <div class="accordion-item">
          <div
            class="accordion-header"
            @click="toggleAccordion(faq.id)">
            <span class="accordion-title">{{ faq.question }}</span>
            <svg
              class="chevron-icon"
              :class="{ rotated: openAccordions.includes(faq.id) }"
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
              v-show="openAccordions.includes(faq.id)"
              class="accordion-content">
              <div class="content-blocks">
                <div
                  v-for="(block, blockIndex) in faq.blocks"
                  :key="blockIndex"
                  class="content-block">
                  <!-- Text block -->
                  <p
                    v-if="block.type === 'text'"
                    class="text-block">
                    {{ block.value }}
                  </p>

                  <!-- Ordered list -->
                  <ol
                    v-else-if="
                      block.type === 'list' && block.listType === 'ordered'
                    "
                    class="list-block ordered">
                    <li
                      v-for="(item, itemIndex) in sanitizeList(block.value)"
                      :key="itemIndex">
                      {{ item }}
                    </li>
                  </ol>

                  <!-- Unordered list -->
                  <ul
                    v-else-if="block.type === 'list'"
                    class="list-block unordered">
                    <li
                      v-for="(item, itemIndex) in sanitizeList(block.value)"
                      :key="itemIndex">
                      {{ item }}
                    </li>
                  </ul>

                  <!-- Image block -->
                  <img
                    v-else-if="block.type === 'image'"
                    :src="block.value"
                    :alt="block.alt || 'FAQ Image'"
                    class="image-block" />
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";

  const faqs = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const openAccordions = ref([]);
  const cloudFrontUrl = import.meta.env.VITE_CLOUDFRONT_URL;

  const toggleAccordion = (faqId) => {
    const index = openAccordions.value.indexOf(faqId);
    if (index > -1) {
      openAccordions.value.splice(index, 1);
    } else {
      openAccordions.value.push(faqId);
    }
  };

  // Normalize and sanitize list input so both arrays and strings work.
  // Accepts either an array of items, or a single string (newline- or
  // numbered-items separated). Returns an array of cleaned strings without
  // leading numeric prefixes so browser ordered lists render correctly.
  const sanitizeList = (items) => {
    let arr = [];

    if (Array.isArray(items)) {
      arr = items;
    } else if (typeof items === "string") {
      const raw = items.trim();
      if (!raw) return [];

      if (raw.includes("\n")) {
        arr = raw
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean);
      } else {
        const parts = raw.split(/(?=\d+[.\)\-:]\s+)/);
        arr = parts.map((s) => s.trim()).filter(Boolean);
        if (arr.length === 0) arr = [raw];
      }
    } else {
      return [];
    }

    return arr.map((it) => {
      if (it == null) return "";
      return String(it)
        .replace(/^\s*\d+[.\)\-:]?\s*/, "")
        .trim();
    });
  };

  const loadAccountSecurityData = async () => {
    try {
      const url = `${cloudFrontUrl}/json-files/account_security.json`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();
      faqs.value = data.faqs || [];
    } catch (err) {
      console.error("Failed to load account security data:", err);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    loadAccountSecurityData();
  });
</script>

<style scoped>
  .account-security-container {
    font-family: "HarmonyOS_Sans", sans-serif;
  }

  .loading-state,
  .error-state {
    padding: 2rem;
    text-align: center;
    color: #6b7280;
  }

  .error-state {
    color: #dc2626;
  }

  .accordion-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .accordion-wrapper {
    width: 100%;
  }

  .accordion-item {
    background-color: #ffffff;
    border-radius: 0.5rem;
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

  .content-blocks {
    padding: 0 1.5rem 1.5rem 1.5rem;
  }

  .content-block {
    margin-bottom: 1rem;
  }

  .content-block:last-child {
    margin-bottom: 0;
  }

  .text-block {
    font-size: 0.9375rem;
    color: #374151;
    line-height: 1.6;
    margin: 0;
  }

  .list-block {
    font-size: 0.9375rem;
    color: #374151;
    line-height: 1.6;
    padding-left: 1.5rem;
    margin: 0;
  }

  .list-block.ordered {
    list-style-type: decimal;
  }

  .list-block.unordered {
    list-style-type: disc;
  }

  .list-block li {
    margin-bottom: 0.5rem;
  }

  .list-block li:last-child {
    margin-bottom: 0;
  }

  .image-block {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 0.5rem 0;
  }

  /* Accordion transition */
  .accordion-enter-active,
  .accordion-leave-active {
    transition: all 0.3s ease;
    max-height: 2000px;
  }

  .accordion-enter-from,
  .accordion-leave-to {
    max-height: 0;
    opacity: 0;
  }
</style>
