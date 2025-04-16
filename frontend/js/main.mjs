import { fetchRandom } from "./api.mjs";
import { createProductCard } from "./product.mjs";

async function fetchFeatured() {
  const products = await fetchRandom();
  products.forEach((product) => {
    $("<swiper-slide>", { class: "card-container" })
      .append(createProductCard(product, true, "featured"))
      .appendTo("#featured-list");
  });
}

fetchFeatured();

const swiperElemenet = document.querySelector("swiper-container");
const swiperParams = {
  slidesPerView: 4,
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    640: {
      slidesPerView: 4,
    },
  },
};

Object.assign(swiperElemenet, swiperParams);

swiperElemenet.initialize();
