const axios = require("axios");
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

Your task is to extract the entire hierarchy from the image and return it in exactly the following JavaScript object format, with correct nesting:

{
  name: "Root Entity Name",
  children: [
    {
      name: "Child Entity A",
      children: [
        { name: "Sub-child Entity A1" },
        { name: "Sub-child Entity A2" },
        {
          name: "Sub-child Entity A3",
          children: [
            { name: "Level 3 Entity A3-1" }
          ]
        }
      ]
    },
    {
      name: "Child Entity B"
    }
  ]
};

Format requirements:
- Include attributes, role, type, or any additional metadata. But don't skip the necessary structure.
- Use the exact keys: 'name' for entity names and 'children' for nested entities
- Every node must contain a name (string).
- Use children (array of nested entities) only if the node has direct sub-entities.
- If a node has no children, only include the name key (no empty children array).
- The **topmost entity** in the chart (typically the parent holding company) should be used as the root "name".
- The output should be a single valid JavaScript object assigned to { ... };
- Return **only** the object assignment — no comments, no extra formatting, no explanation.

Ensure strict syntax validity (parse it as JavaScript object) and correct structural nesting.
`
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
        max_tokens: 3072
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
