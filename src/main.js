import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

// Set favicon dynamically to use the small 1MAX icon from assets
import faviconUrl from "./assets/images/g-1max-icon.png";

const setFavicon = (url) => {
  try {
    let link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/png";
    link.rel = "icon";
    link.href = url;
    if (!link.parentNode)
      document.getElementsByTagName("head")[0].appendChild(link);
  } catch (e) {
    // ignore in non-browser environments
  }
};

if (typeof document !== "undefined") {
  setFavicon(faviconUrl);
  // Ensure title matches app requirement
  document.title = document.title || "1MAX Help Center";
}

createApp(App).mount("#app");
