<template>
  <div id="app">
    <div class="container">
      <form @submit.prevent="generateImage" class="container__field-container">
        <input
          v-model="prompt"
          placeholder="Сообщить AI"
          type="text"
          class="container__field"
        />
        <button type="submit" class="container__field-btn">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="icon-2xl"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
              fill="#f4f4f4"
            ></path>
          </svg>
        </button>
      </form>
      <div v-if="imageUrl" class="container__image-container">
        <img :src="imageUrl" alt="Generated image" />
      </div>
      <div v-else-if="isLoading" class="container__loading">
        <div ref="progressRing" class="container__progress-ring"></div>
        <span class="container__text"> Генерация изображения... </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import lottie from "lottie-web";

const prompt = ref("");
const imageUrl = ref("");
const isLoading = ref(false);
const progressRing = ref<HTMLElement | null>(null);
const error = ref("");

const generateImage = async () => {
  if (!prompt.value) {
    alert("Please enter a prompt");
    return;
  }
  isLoading.value = true;
  nextTick(() => {
    if (progressRing.value) {
      const animation = lottie.loadAnimation({
        container: progressRing.value!,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/animations/progress-ring.json",
      });
    } else {
      console.error("Progress ring element is null");
    }
  });
  error.value = "";

  try {
    const response = await axios.post("/api/generateImage", {
      prompt: prompt.value,
    });

    if (response.data && response.data.imageUrl) {
      imageUrl.value = response.data.imageUrl;
      prompt.value = "";
    } else {
      throw new Error("Image generation failed, no image URL found.");
    }
  } catch (err) {
    console.error("Error generating image:", err);
    error.value = "Failed to generate image. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss">
@import "@/assets/App.scss";
html {
  box-sizing: border-box;
}
*,
*::after,
*::before {
  box-sizing: inherit;
  /* outline: solid 1px red; */
}
body {
  min-width: 20em;
  background-color: #1e1e1e;
  margin: 0rem auto;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 0.938rem;
  margin: auto 0;

  &__field-container {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }
  &__field {
    @include input;
    background-color: #f4f4f4;
    height: 52px;
    width: 100%;
    border-radius: 26px;
    padding: 0 3rem 0 1rem;
    outline: none;
    font-family: "Pragmatica Book";
    font-size: 1rem;
    color: #000;
  }
  &__field::placeholder {
    font-family: "Pragmatica Book";
    font-size: 1rem;
    color: #000;
  }
  &__field-btn {
    position: absolute;
    @include btn;
    background-color: #d7d7d7;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    right: 0.375rem;
  }
  &__image-container {
    margin-top: 1rem;

    img {
      max-width: 100%;
      width: 100%;
      border-radius: 8px;
    }
  }
  &__loading {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    @include flex-centered;
    flex-direction: column;
    gap: 1.563rem;
    height: 500px;
  }
  &__progress-ring {
    width: 200px;
    height: 200px;
  }
  &__text {
    text-align: center;
    font-family: "Pragmatica Medium";
    font-size: 1rem;
    color: #f4f4f4;
  }
}
/* 1024px = 64em */
@media (min-width: 64em) {
  .container {
    padding: 2rem;

    &__field-container {
      width: 640px;
    }
    &__image-container {
      img {
        height: 600px;
      }
    }
  }
}
/* 1200px = 75em */
@media (min-width: 75em) {
  .container {
    &__field-container {
      width: 768px;
    }
  }
}
</style>
