



const contents = [
  {
    inlineData: {
      mimeType: "image/jpeg",
      data: "",
    },
  },
  { text: "" },
];
async function runGemini({ image, prompt }) {
  if (!prompt) {
    throw new Error("Gemini: prompt is required");
  }

  const { gemini } = await import("./gemini_module.mjs");

  let contents;

  // 🟢 لو في صورة
  if (image) {
    const base64Image = Buffer.isBuffer(image)
      ? image.toString("base64")
      : image; // لو جاية base64 أصلاً

    contents = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
      { text: prompt },
    ];
  }
  // 🟢 Text فقط
  else {
    contents = [{ text: prompt }];
  }

  return gemini(contents);
}

module.exports = { runGemini };
