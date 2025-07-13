import axios from "axios";

const TOGETHER_API_KEY = import.meta.env.VITE_TOGETHER_API_KEY; // Use environment variable for security

export async function generatePrompt(goal, category) {
  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [
          {
            role: "system",
            content:
              "You are a prompt engineer. Given a user's goal and category, generate a high-quality prompt they can use with an AI tool.",
          },
          {
            role: "user",
            content: `Goal: ${goal}\nCategory: ${category}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating prompt:", error);
    return "Something went wrong.";
  }
} 