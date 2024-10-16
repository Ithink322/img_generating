import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log("Body received:", body);
  const prompt = body.prompt;

  if (!prompt) {
    throw new Error("Prompt is missing in the request body");
  }

  try {
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("n", "1");
    formData.append("size", "1024x1024");

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer sk-ZPi05hctckvbIFSuaohvCBJ6cWcVkhjCoYxppL8hPpl4S30W`, // sk-MHoAmBTYD13j1nTwIZLMRLJJHQcpxkItOSh4jL0YrUHTCLBl
          Accept: "application/json",
        },
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("API Response Data:", data);

      if (data.image) {
        const imageUrl = `data:image/png;base64,${data.image}`;
        return { imageUrl };
      } else {
        throw new Error("No image found in the API response");
      }
    } else {
      const errorData = await response.json();
      console.error("Stability API error:", response.statusText, errorData);
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error calling Stability API:", error);
    throw new Error("Failed to generate image");
  }
});
