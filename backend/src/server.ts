import { app } from './app';
import { AppDataSource } from './config/data-source';

const port = process.env.PORT || 3000;

// Inicializar la conexión a la base de datos antes de iniciar el servidor
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
