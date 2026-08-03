import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy GoogleGenAI client
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not defined");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 10. Gemini AI Smart Advisor & Digital Wellbeing Endpoint
app.post("/api/gemini/advisor", async (req, res) => {
  try {
    const { buildingName, unitNumber, tenantName, appliances, monthlyElectricityKWh, monthlyWaterLiters, userQuery } = req.body;

    const aiClient = getGenAIClient();

    const systemInstruction = `
أنت مساعد الذكاء الاصطناعي "جيميناي للرفاهية الرقمية والتحكم الذكي بالمباني" (Gemini Smart Building & Digital Wellbeing Advisor).
مهامك:
1. تحليل استهلاك الكهرباء والماء للشقة والمبنى وتقديم حلول عملية لترشيد الطاقة بنسبة 20-35%.
2. تقديم توصيات "الرفاهية الرقمية" (Digital Wellbeing) لتحسين نوم الساكن، وجدولة إضاءة مريحة، ونمط هادئ بدون ضوضاء إلكترونية.
3. كتابة الأجوبة باللغة العربية بأسلوب راقٍ ومباشر وسهل القراءة.
4. إرجاع النتائج بتنسيق سليم وواضح.
`;

    const prompt = `
معلومات السياق:
- المبنى: ${buildingName || "برج الواحة الذكي"}
- الشقة: ${unitNumber || "101"}
- الساكن: ${tenantName || "الساكن الحالي"}
- إجمالي استهلاك الكهرباء الشهري: ${monthlyElectricityKWh || 385} ك.و.س
- إجمالي استهلاك الماء الشهري: ${monthlyWaterLiters || 4200} لتر
- قائمة الأجهزة الموصولة:
${JSON.stringify(appliances || [], null, 2)}

سؤال/طلب المستخدم:
"${userQuery || "اعطني نصائح رفاهية رقمية وترشيد طاقة مخصصة لشقتي"}"
`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ success: true, answer: response.text });
  } catch (error: any) {
    console.error("Gemini Advisor API Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "حدث خطأ أثناء الاتصال بمساعد جيميناي",
      fallbackAnswer: "تعذر الاتصال بخدمة Gemini AI مؤقتاً. يرجى التأكد من ضبط مفتاح GEMINI_API_KEY في إعدادات النظام."
    });
  }
});

// 10. Gemini AI Natural Language Smart Control Endpoint
app.post("/api/gemini/command", async (req, res) => {
  try {
    const { command, appliances } = req.body;
    const aiClient = getGenAIClient();

    const systemInstruction = `
أنت خبير التحكم الأوتوماتيكي بالأجهزة الذكية. قام المستخدم بإعطاء أمر باللغة العربية.
قم بتحليل الأمر وتحديد الأجهزة التي ينبغي تشغيلها أو إيقافها أو جدولة تشغيلها.
أرجع إجابة مشروحة ومقترحات أوتوماتيكية باللغة العربية.
`;

    const prompt = `
الأمر المدخل: "${command}"
قائمة الأجهزة الحالية المتاحة:
${JSON.stringify(appliances || [], null, 2)}
`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    res.json({ success: true, resultText: response.text });
  } catch (error: any) {
    console.error("Gemini Command API Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "حدث خطأ أثناء معالجة الأمر الذكي",
    });
  }
});

// Vite middleware in dev or static serve in production
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
});
