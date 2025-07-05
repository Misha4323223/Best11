import express, { type Request, Response, NextFunction } from "express";
// Этот импорт вызывает ошибку из-за неверного форматирования в deepspeek-provider.js
// Отключаем прямой импорт проблемного файла
process.env.SKIP_DEEPSPEEK_ORIGINAL = 'true';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from 'cors';

// Инициализируем векторизатор-менеджер (lazy loading)
let vectorizerManager: any = null;

const app = express();
app.use(cors()); // Разрешаем CORS для всех маршрутов
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Статическая раздача загруженных файлов
app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));
app.use('/output', express.static('output'));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Инициализируем векторизатор-менеджер (lazy loading)
  try {
    vectorizerManager = await import('./vectorizer-manager');
    log('Vectorizer Manager initialized');
  } catch (error) {
    log('Vectorizer Manager initialization deferred');
  }

  // Используем переменную окружения PORT если она доступна, иначе 5000
  // Это критично для правильной работы в окружении Replit
  // Подключение маршрутов (через динамический import для совместимости)
  const chatRoutes = await import('./routes/chatRoutes');
  const streamingRoutes = await import('./routes/streamingRoutes');
  const imageRoutes = await import('./routes/imageRoutes');
  const checkpointRoutes = await import('./routes/checkpointRoutes');
  const directAIRoutes = await import('./routes/directAIRoutes');
  const searchRoutes = await import('./routes/searchRoutes');
  const smartChatRoutes = await import('./routes/smartChatRoutes');
  const commercialRoutes = await import('./routes/commercialRoutes');
  const reportRoutes = await import('./routes/reportRoutes');
  const embroideryRoutes = await import('./routes/embroideryRoutes');
  const vectorRoutes = await import('./routes/vectorRoutes');
  const deepspeekRoutes = await import('./routes/deepspeekRoutes');
  const pythonRoutes = await import('./routes/pythonRoutes');

  app.use('/api/chat', chatRoutes);
  app.use('/api/stream', streamingRoutes);
  app.use('/api/images', imageRoutes);
  app.use('/api/checkpoints', checkpointRoutes);
  app.use('/api/direct-ai', directAIRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/smart-chat', smartChatRoutes);
  app.use('/api/commercial', commercialRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/embroidery', embroideryRoutes);
  app.use('/api/vector', vectorRoutes);
  app.use('/api/deepspeek', deepspeekRoutes);
  app.use('/api/python', pythonRoutes);

  // 🧠 НОВИНКА: Интеллектуальное улучшение изображений
  const enhancedImageRoutes = await import('./enhanced-image-routes.js');
  app.use('/api/enhanced-images', enhancedImageRoutes);

  const PORT = process.env.PORT || 5000;
  server.listen({
    port: PORT,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${PORT}`);
  });
})();