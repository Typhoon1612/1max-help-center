<template>
  <div class="test-page">
    <h1>Test Page - FAQ Data Loader</h1>

    <div v-if="loading">Loading...</div>

    <div
      v-else-if="faqData"
      class="faq-container">
      <h2>{{ faqData.category }}</h2>

      <div
        v-for="faq in faqData.faqs.slice(0, 5)"
        :key="faq.id"
        class="faq-item">
        <h3>{{ faq.question }}</h3>

        <div
          v-if="faq.blocks && faq.blocks.length > 0"
          class="blocks">
          <div
            v-for="(block, index) in faq.blocks"
            :key="index"
            class="block">
            <!-- Text block -->
            <p
              v-if="block.type === 'text'"
              class="text-block">
              {{ block.value }}
            </p>

            <!-- List block -->
            <ol
              v-if="block.type === 'list' && block.listType === 'ordered'"
              class="list-block ordered">
              <li
                v-for="(item, i) in block.value"
                :key="i">
                {{ item }}
              </li>
            </ol>
            <ul
              v-else-if="block.type === 'list'"
              class="list-block unordered">
              <li
                v-for="(item, i) in block.value"
                :key="i">
                {{ item }}
              </li>
            </ul>

            <!-- Image block -->
            <img
              v-if="block.type === 'image'"
              :src="block.value"
              :alt="block.alt || 'FAQ Image'"
              class="image-block" />

            <!-- Other block types -->
            <div v-if="!['text', 'list', 'image'].includes(block.type)">
              Type: {{ block.type }} - {{ JSON.stringify(block.value) }}
            </div>
          </div>
        </div>

        <p
          v-else
          class="no-content">
          No content blocks
        </p>
      </div>
    </div>

    <div
      v-else
      class="error">
      Failed to load FAQ data
    </div>
  </div>
</template>

<script>
  import { ref, onMounted } from "vue";
  import spotTradingData from "../assets/faq_data_master/json-files/spot_trading.json";

  export default {
    name: "TestPage",
    setup() {
      const faqData = ref(null);
      const loading = ref(true);

      onMounted(() => {
        try {
          // Load the JSON data
          faqData.value = spotTradingData;
          loading.value = false;
          console.log("FAQ Data loaded:", faqData.value);
        } catch (error) {
          console.error("Error loading FAQ data:", error);
          loading.value = false;
        }
      });

      return {
        faqData,
        loading,
      };
    },
  };
</script>

<style scoped>
  .test-page {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  h1 {
    color: #333;
    margin-bottom: 30px;
    font-size: 28px;
  }

  h2 {
    color: #0066cc;
    margin-bottom: 20px;
    font-size: 24px;
    border-bottom: 2px solid #0066cc;
    padding-bottom: 10px;
  }

  .faq-container {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
  }

  .faq-item {
    background: white;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .faq-item h3 {
    color: #333;
    margin-bottom: 15px;
    font-size: 18px;
  }

  .blocks {
    margin-top: 10px;
  }

  .block {
    margin-bottom: 10px;
  }

  .text-block {
    color: #555;
    line-height: 1.6;
    margin: 0;
  }

  .list-block {
    color: #555;
    line-height: 1.6;
    padding-left: 20px;
    margin: 10px 0;
  }

  .list-block.ordered {
    list-style-type: decimal;
  }

  .list-block.unordered {
    list-style-type: disc;
  }

  .list-block li {
    margin-bottom: 5px;
  }

  .image-block {
    max-width: 100%;
    height: auto;
    margin: 10px 0;
    border-radius: 4px;
  }

  .no-content {
    color: #999;
    font-style: italic;
  }

  .error {
    color: #cc0000;
    padding: 20px;
    background: #ffe6e6;
    border-radius: 6px;
  }

  .loading {
    text-align: center;
    padding: 40px;
    color: #666;
  }
</style>
