import crypto from 'node:crypto';

// Array privado en memoria para almacenar los productos
const products = [
  {
    id: 'd9b23b32-8499-4c57-a169-dc81c3c9fb60',
    name: 'Silla Gamer RGB Ergonómica',
    price: 249.99,
    stock: 12,
    description: 'Silla ergonómica de alto rendimiento con luces RGB ajustables, soporte lumbar magnético y apoyabrazos 4D. Ideal para largas sesiones de juego.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // Hace 5 días
  },
  {
    id: 'f32a514e-4f18-4dfb-9ef1-8ee714a84976',
    name: 'Teclado Mecánico Pro Wireless',
    price: 189.50,
    stock: 5,
    description: 'Teclado mecánico premium formato 75% con switches hot-swappable lubricados de fábrica, triple conectividad y chasis de aluminio CNC.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // Hace 2 días
  },
  {
    id: 'b14ca92e-33f7-4a0b-8dc2-482a884cd80e',
    name: 'Monitor curvo IPS 34" Ultrawide',
    price: 599.00,
    stock: 0, // Sin stock para probar el diseño de "Sin Stock"
    description: 'Monitor ultrawide 21:9 con panel IPS, resolución 3440x1440px, tasa de refresco de 160Hz y 1ms de respuesta. Colores vibrantes y diseño frameless.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // Hace 10 días
  }
];

export class ProductModel {
  /**
   * Obtiene todos los productos (devuelve una copia para evitar mutaciones externas).
   * @returns {Array} Lista de productos
   */
  static findAll() {
    return [...products].sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Busca un producto por su ID.
   * @param {string} id - UUID del producto
   * @returns {Object|null} El producto encontrado o null
   */
  static findById(id) {
    const product = products.find(p => p.id === id);
    return product ? { ...product } : null;
  }

  /**
   * Crea y valida un nuevo producto.
   * @param {Object} data - Datos del nuevo producto
   * @returns {Object} El producto creado
   * @throws {Error} Si las validaciones fallan
   */
  static create({ name, price, stock, description }) {
    const errors = this._validate({ name, price, stock });

    if (errors.length > 0) {
      throw new Error(errors.join(' | '));
    }

    const newProduct = {
      id: crypto.randomUUID(),
      name: name.trim(),
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      description: description ? description.trim() : '',
      createdAt: new Date()
    };

    products.push(newProduct);
    return { ...newProduct };
  }

  /**
   * Actualiza un producto existente.
   * @param {string} id - UUID del producto a editar
   * @param {Object} data - Campos a actualizar
   * @returns {Object|null} El producto actualizado o null si no existe
   * @throws {Error} Si las validaciones fallan
   */
  static update(id, { name, price, stock, description }) {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const errors = this._validate({ name, price, stock });
    if (errors.length > 0) {
      throw new Error(errors.join(' | '));
    }

    products[index] = {
      ...products[index],
      name: name.trim(),
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      description: description ? description.trim() : ''
    };

    return { ...products[index] };
  }

  /**
   * Elimina un producto.
   * @param {string} id - UUID del producto a eliminar
   * @returns {boolean} True si se eliminó, false de lo contrario
   */
  static delete(id) {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;

    products.splice(index, 1);
    return true;
  }

  /**
   * Validador interno de campos obligatorios y tipos.
   * @private
   */
  static _validate({ name, price, stock }) {
    const errors = [];

    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      errors.push('El nombre es obligatorio y debe tener al menos 3 caracteres.');
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      errors.push('El precio debe ser un número mayor a cero.');
    }

    const parsedStock = parseInt(stock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      errors.push('El stock debe ser un número entero no negativo.');
    }

    return errors;
  }
}
