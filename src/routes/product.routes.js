import express from 'express';
import { ProductController } from '../controllers/product.controller.js';

const router = express.Router();

// Ruta raíz del módulo: listar todos los productos
router.get('/', ProductController.getProducts);

// Mostrar formulario de alta
router.get('/new', ProductController.showCreateForm);

// Procesar el alta de producto
router.post('/', ProductController.createProduct);

// Detalle de un producto individual (¡importante ponerlo después de /new para evitar conflictos!)
router.get('/:id', ProductController.getProductById);

// Mostrar formulario de edición
router.get('/:id/edit', ProductController.showEditForm);

// Procesar la edición de producto
router.post('/:id/edit', ProductController.updateProduct);

// Procesar la eliminación de producto
router.post('/:id/delete', ProductController.deleteProduct);

export default router;
