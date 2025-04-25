import { app } from './app';
import { AppDataSource } from './config/data-source';

(async () => {
  await AppDataSource.initialize();
  const PORT = 4000;
  app.listen(PORT, () =>
    console.log(`🟢 API escuchando en http://localhost:${PORT}`)
  );
})();
