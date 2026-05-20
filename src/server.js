import app from './app.js';

const PORT = process.env.PORT || 6074;

app.listen(PORT, () => {
  console.log('==================================================');
  console.log(`🚀 ¡SERVIDOR MVC CON EJS CORRIENDO, LOCO!`);
  console.log(`🔗 Ingresá a la tienda en: http://localhost:${PORT}`);
  console.log(`📂 Almacenamiento en array listo con datos semilla.`);
  console.log('==================================================');
});
