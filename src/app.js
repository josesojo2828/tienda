import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import productRoutes from './routes/product.routes.js';

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

console.log(__dirname);

// Configuración del motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
// ¡CRÍTICO para capturar datos de formularios HTML estándar!
app.use(express.urlencoded({ extended: true }));

// Servidor de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas del Módulo de Productos
app.use('/products', productRoutes);

// Manejador de rutas inexistentes (404)
app.use((req, res, next) => {
  res.status(404).render('products/show', {
    title: 'Página no encontrada',
    product: null,
    error: 'La página que estás buscando no existe o fue movida.'
  });
});

// Manejador general de errores (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Ups, algo salió muy mal en el servidor! Detalle: ' + err.message);
});

export default app;
