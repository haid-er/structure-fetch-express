const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ApiError = require("../utils/ApiError");
const { STATUS_CODES } = require("../utils/constants");

const endpoint = process.env.AZURE_OPENAI_ENDPOINT; // e.g., https://<your-resource-name>.openai.azure.com/
const apiKey = process.env.AZURE_OPENAI_KEY;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT; // your deployed model name
const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-05-01-preview";

async function extractHierarchyFromImage(imageUrl) {
    console.log("🔍 Extracting hierarchy from image:", imageUrl);
    try {
        const url = `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

        const messages = [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `You are given an organizational-chart image that visually represents entities and their hierarchical ownership or control structure.

1. Extract the complete hierarchy into exactly this JSON structure (no array wrapper):

{
  "name": "Entity Name",
  "attributes": {
    "Key1": "Value1",
    "Key2": "Value2"
  },
  "children": [
    { /* nested entity */ }
  ]
}

2. Immediately after generating the JSON, parse it yourself (simulate a JSON.parse).
   - If parsing fails, correct any syntax errors (commas, quotes, brackets).
   - If parsing succeeds, verify every node has "name" (string), "attributes" (object), and "children" (array).
   - If any node is missing a required key or has the wrong type, insert or fix it.

3. Return only the final, valid JSON object. Do NOT include any explanations, error messages, or extra text—just the corrected JSON.`
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: imageUrl
                        }
                    }
                ]
            }
        ];

        const response = await axios.post(
            url,
            {
                messages,
                temperature: 0,
                max_tokens: 2048
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-key": apiKey
                }
            }
        );

        const reply = response.data.choices[0].message.content;
        return reply;
    } catch (error) {
        console.error("❌ Azure OpenAI Error:", error.response?.data || error.message);
        throw new ApiError(STATUS_CODES.BAD_REQUEST, error.message || "Failed to extract hierarchy from image", error);
    }
}


module.exports = {
    extractHierarchyFromImage
};
