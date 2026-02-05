import { ref } from "vue";

/**
 * Composable for fetching data from CloudFront.
 * @param {string} pathOrUrl - Relative path (e.g., 'json-files/task_center.json') or absolute URL
 * @returns {{ data: Ref, loading: Ref<boolean>, error: Ref<string|null>, reload: Function }}
 */
export function useCloudfrontFetcher(pathOrUrl) {
  const data = ref(null);
  const loading = ref(true);
  const error = ref(null);

  const reload = async () => {
    loading.value = true;
    error.value = null;
    data.value = null;

    try {
      const base = import.meta.env.VITE_CLOUDFRONT_URL;
      if (!base) {
        throw new Error("VITE_CLOUDFRONT_URL environment variable is not set");
      }

      // Resolve URL: if pathOrUrl is absolute, use it; otherwise prepend base
      const fullUrl = pathOrUrl.startsWith("http")
        ? pathOrUrl
        : `${base}/${pathOrUrl.replace(/^\/+/, "")}`;

      const response = await fetch(fullUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch: ${response.status} ${response.statusText}`,
        );
      }

      const json = await response.json();
      data.value = json;
    } catch (err) {
      console.error("[useCloudfrontFetcher] Error:", err);
      error.value = err.message || "Unknown error occurred";
    } finally {
      loading.value = false;
    }
  };

  // Initial load
  reload();

  return {
    data,
    loading,
    error,
    reload,
  };
}
