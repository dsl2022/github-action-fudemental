import express from 'express';

export function createApp() {
  const app = express();
  app.use(express.json());
  const tasks = [];
  app.get('/tasks', (_req, res) => res.json(tasks));
  app.post('/tasks', (req, res) => {
    const t = { id: tasks.length + 1, title: String(req.body?.title ?? '') };
    tasks.push(t);
    res.status(201).json(t);
  });
  return app;
}
