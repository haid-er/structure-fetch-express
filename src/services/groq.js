require('dotenv').config();
const Groq = require("groq-sdk")
const fs = require('fs');
const path = require('path');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function mainGroq(imagePath) {
    const imageDataUrl = getImageDataUrl(imagePath);
    const chatCompletion = await getGroqChatCompletion(imageDataUrl);
    // console.log("Groq Response:", JSON.stringify(chatCompletion, null, 2)); // 🔍 Debug

    // Make sure choices exists and has at least one entry
    if (!chatCompletion?.choices || chatCompletion.choices.length === 0) {
        throw new Error("No choices returned from Groq");
    }

    return chatCompletion.choices[0].message?.content || "Nothing";
}

async function getGroqChatCompletion(imageDataUrl) {
    return groq.chat.completions.create({
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": `You are given an organizational chart image that visually represents entities and their hierarchical ownership or control structure.

Your task is to extract the complete hierarchy from the image and output it in **exactly this JSON structure** (no array wrapper):

{
  "name": "Entity Name",
  "attributes": {
    "Key1": "Value1",
    "Key2": "Value2"
  },
  "children": [
    { ... nested entity ... }
  ]
}

Rules:
- Each box in the chart is one node.
- Use the text inside the box as "name".
- Extract descriptive information (e.g., Type, Jurisdiction, Units, Currency, Tax Status, etc.) into the "attributes" object.
- If a node connects to others (visually downward), nest those under its "children" key.
- The **bottom-most** company or entity (e.g. parent corp) should be used as the root node.
- Use **exact nesting** to reflect visual ownership hierarchy.
- Combine duplicate keys like "Type" into a single comma-separated value.
- Do not include any explanation or formatting before or after the JSON — only return the **raw JSON object**.

Return the following **exact** output JSON object, and nothing else.`
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": imageDataUrl
                        }
                    }
                ]
            }
        ],
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "temperature": 1,
        "max_completion_tokens": 1024,
        "top_p": 1,
        "stream": false,
        "stop": null
    });
}


function getImageDataUrl(imagePath) {
    const imageBuffer = fs.readFileSync(imagePath);
    const ext = path.extname(imagePath).toLowerCase().replace('.', '');

    // Supported MIME types (adjust if necessary)
    const mimeTypes = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
    };

    const mimeType = mimeTypes[ext];
    if (!mimeType) {
        throw new Error('Unsupported image format. Use PNG, JPG, or GIF.');
    }

    const base64Image = imageBuffer.toString('base64');
    return `data:${mimeType};base64,${base64Image}`;
}

module.exports = { mainGroq };
