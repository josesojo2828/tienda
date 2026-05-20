import { ProductModel } from '../models/product.model.js';

export class ProductController {
  /**
   * GET /products
   * Muestra la vista con la grilla de todos los productos.
   */
  static getProducts(req, res) {
    try {
      const products = ProductModel.findAll();
      res.render('products/index', {
        title: 'Panel de Productos',
        products,
        error: null
      });
    } catch (error) {
      res.status(500).render('products/index', {
        title: 'Panel de Productos',
        products: [],
        error: 'Error al recuperar los productos: ' + error.message
      });
    }
  }

  /**
   * GET /products/:id
   * Muestra el detalle de un producto específico.
   */
  static getProductById(req, res) {
    const { id } = req.params;
    const product = ProductModel.findById(id);

    if (!product) {
      return res.status(404).render('products/show', {
        title: 'Producto no encontrado',
        product: null,
        error: 'El producto buscado no existe o fue eliminado.'
      });
    }

    res.render('products/show', {
      title: product.name,
      product,
      error: null
    });
  }

  /**
   * GET /products/new
   * Renderiza el formulario para crear un producto.
   */
  static showCreateForm(req, res) {
    res.render('products/new', {
      title: 'Nuevo Producto',
      product: {}, // Objeto vacío para que la vista no rompa
      error: null
    });
  }

  /**
   * POST /products
   * Procesa la creación de un nuevo producto.
   */
  static createProduct(req, res) {
    const { name, price, stock, description } = req.body;

    try {
      ProductModel.create({ name, price, stock, description });
      res.redirect('/products');
    } catch (error) {
      // Si hay error de validación, volvemos a renderizar el formulario
      // pasando los datos que el usuario ya ingresó para que no los pierda. ¡UX Premium!
      res.status(400).render('products/new', {
        title: 'Nuevo Producto',
        product: { name, price, stock, description },
        error: error.message
      });
    }
  }

  /**
   * GET /products/:id/edit
   * Renderiza el formulario para editar un producto existente.
   */
  static showEditForm(req, res) {
    const { id } = req.params;
    const product = ProductModel.findById(id);

    if (!product) {
      return res.status(404).render('products/index', {
        title: 'Panel de Productos',
        products: ProductModel.findAll(),
        error: 'No se puede editar: El producto no existe.'
      });
    }

    res.render('products/edit', {
      title: `Editar: ${product.name}`,
      product,
      error: null
    });
  }

  /**
   * POST /products/:id/edit
   * Procesa la actualización de un producto existente.
   */
  static updateProduct(req, res) {
    const { id } = req.params;
    const { name, price, stock, description } = req.body;

    try {
      const updatedProduct = ProductModel.update(id, { name, price, stock, description });
      
      if (!updatedProduct) {
        return res.status(404).render('products/index', {
          title: 'Panel de Productos',
          products: ProductModel.findAll(),
          error: 'No se pudo actualizar: El producto no existe.'
        });
      }

      res.redirect(`/products/${id}`);
    } catch (error) {
      // Igualmente acá, si falla la validación, volvemos a mostrar la edición conservando el id y datos erróneos
      res.status(400).render('products/edit', {
        title: 'Editar Producto',
        product: { id, name, price, stock, description },
        error: error.message
      });
    }
  }

  /**
   * POST /products/:id/delete
   * Procesa la eliminación del producto.
   */
  static deleteProduct(req, res) {
    const { id } = req.params;
    const deleted = ProductModel.delete(id);

    if (!deleted) {
      return res.status(404).render('products/index', {
        title: 'Panel de Productos',
        products: ProductModel.findAll(),
        error: 'No se pudo eliminar: El producto no existe.'
      });
    }

    res.redirect('/products');
  }
}
