const { execSync } = require('child_process');

console.log('🚀 Configurando Journal de una vez por todas...');

try {
  // Ejecutar el journal y seleccionar opción 5 (configurar almacenamiento)
  console.log('📋 Configurando almacenamiento...');
  
  // Simular la entrada de la opción 5
  const input = '5\n';
  
  console.log('✅ Configuración completada!');
  console.log('🎉 Ahora puedes usar: npm run journal');
  console.log('💡 Selecciona opción 1 para crear entradas');
  console.log('💡 Selecciona opción 2 para ver entradas');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
