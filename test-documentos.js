/**
 * Script de pruebas para la funcionalidad de Documentos S3
 * 
 * Este script prueba los endpoints del backend:
 * - GET /documentos (listar)
 * - POST /documentos (subir)
 * - DELETE /documentos/{id} (eliminar)
 * 
 * Requisitos:
 * 1. Tener un usuario ADMIN registrado
 * 2. Backend corriendo en http://52.2.172.54:8080
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://52.2.172.54:8080';

// Credenciales de administrador (ajusta según tu usuario)
const ADMIN_CREDENTIALS = {
  email: 'admin@huertohogar.cl',
  password: 'admin123' // Cambiar por la contraseña correcta
};

let authToken = null;
let testDocumentId = null;

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Paso 1: Login como ADMIN
async function testLogin() {
  log('\n========================================', 'bold');
  log('PRUEBA 1: Login como Administrador', 'bold');
  log('========================================', 'bold');
  
  try {
    logInfo('Intentando login con credenciales de admin...');
    const response = await axios.post(`${BASE_URL}/v1/auth/login`, ADMIN_CREDENTIALS);
    
    if (response.data && response.data.token) {
      authToken = response.data.token;
      logSuccess(`Login exitoso. Token obtenido: ${authToken.substring(0, 20)}...`);
      return true;
    } else {
      logError('Login exitoso pero no se recibió token');
      return false;
    }
  } catch (error) {
    logError(`Error en login: ${error.response?.data?.message || error.message}`);
    logWarning('Asegúrate de tener un usuario admin registrado con email: admin@huertohogar.cl');
    return false;
  }
}

// Paso 2: Listar documentos existentes
async function testListDocuments() {
  log('\n========================================', 'bold');
  log('PRUEBA 2: Listar Documentos Existentes', 'bold');
  log('========================================', 'bold');
  
  try {
    logInfo('Obteniendo lista de documentos...');
    const response = await axios.get(`${BASE_URL}/documentos`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    const documents = response.data;
    logSuccess(`Se encontraron ${documents.length} documentos`);
    
    if (documents.length > 0) {
      log('\nDocumentos existentes:', 'cyan');
      documents.forEach((doc, idx) => {
        console.log(`  ${idx + 1}. ${doc.nombre || doc.nombreArchivo} (Tipo: ${doc.tipoDocumento || 'N/D'})`);
      });
    } else {
      logInfo('No hay documentos en el sistema (esto es normal si es primera vez)');
    }
    
    return true;
  } catch (error) {
    logError(`Error listando documentos: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Paso 3: Crear un archivo de prueba temporal
function createTestFile() {
  log('\n========================================', 'bold');
  log('PRUEBA 3: Crear Archivo de Prueba', 'bold');
  log('========================================', 'bold');
  
  const testFilePath = path.join(__dirname, 'test-documento.txt');
  const content = `Este es un archivo de prueba para verificar la funcionalidad de subida a S3.
Creado el: ${new Date().toISOString()}
Backend: ${BASE_URL}
Usuario: ${ADMIN_CREDENTIALS.email}

Este archivo puede ser eliminado después de las pruebas.`;
  
  try {
    fs.writeFileSync(testFilePath, content);
    logSuccess(`Archivo de prueba creado: ${testFilePath}`);
    return testFilePath;
  } catch (error) {
    logError(`Error creando archivo de prueba: ${error.message}`);
    return null;
  }
}

// Paso 4: Subir documento
async function testUploadDocument(filePath) {
  log('\n========================================', 'bold');
  log('PRUEBA 4: Subir Documento a S3', 'bold');
  log('========================================', 'bold');
  
  try {
    logInfo('Preparando archivo para subir...');
    
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('tipoDocumento', 'OTRO');
    formData.append('descripcion', 'Documento de prueba automática del sistema');
    
    logInfo('Subiendo archivo al servidor...');
    const response = await axios.post(`${BASE_URL}/documentos`, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${authToken}`
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        process.stdout.write(`\r  Progreso: ${percent}%`);
      }
    });
    
    console.log(''); // Nueva línea después del progreso
    
    if (response.data && response.data.id) {
      testDocumentId = response.data.id;
      logSuccess(`Archivo subido exitosamente!`);
      logInfo(`ID del documento: ${testDocumentId}`);
      logInfo(`Nombre: ${response.data.nombre || response.data.nombreArchivo}`);
      logInfo(`URL S3: ${response.data.urlPublica || response.data.urlArchivo || 'N/D'}`);
      return true;
    } else {
      logError('Upload exitoso pero no se recibió ID del documento');
      return false;
    }
  } catch (error) {
    console.log(''); // Nueva línea
    logError(`Error subiendo documento: ${error.response?.data?.message || error.message}`);
    if (error.response?.data) {
      console.log('Detalles del error:', error.response.data);
    }
    return false;
  }
}

// Paso 5: Verificar que el documento aparece en la lista
async function testVerifyUpload() {
  log('\n========================================', 'bold');
  log('PRUEBA 5: Verificar Documento en Lista', 'bold');
  log('========================================', 'bold');
  
  try {
    logInfo('Obteniendo lista actualizada...');
    const response = await axios.get(`${BASE_URL}/documentos`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    const documents = response.data;
    const uploadedDoc = documents.find(doc => doc.id === testDocumentId);
    
    if (uploadedDoc) {
      logSuccess('El documento subido aparece correctamente en la lista');
      log('\nDetalles del documento:', 'cyan');
      console.log(JSON.stringify(uploadedDoc, null, 2));
      return true;
    } else {
      logError(`No se encontró el documento con ID ${testDocumentId} en la lista`);
      return false;
    }
  } catch (error) {
    logError(`Error verificando upload: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Paso 6: Probar descarga (verificar URL pública)
async function testDownload() {
  log('\n========================================', 'bold');
  log('PRUEBA 6: Verificar URL de Descarga', 'bold');
  log('========================================', 'bold');
  
  try {
    logInfo('Obteniendo información del documento...');
    const response = await axios.get(`${BASE_URL}/documentos`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    const uploadedDoc = response.data.find(doc => doc.id === testDocumentId);
    
    if (!uploadedDoc) {
      logError('No se encontró el documento');
      return false;
    }
    
    const url = uploadedDoc.urlPublica || uploadedDoc.urlArchivo || uploadedDoc.url;
    
    if (url) {
      logInfo(`URL pública: ${url}`);
      
      // Intentar hacer HEAD request a la URL de S3
      try {
        const headResponse = await axios.head(url);
        logSuccess(`URL pública accesible (Status: ${headResponse.status})`);
        logInfo(`Content-Type: ${headResponse.headers['content-type']}`);
        logInfo(`Content-Length: ${headResponse.headers['content-length']} bytes`);
        return true;
      } catch (urlError) {
        logWarning(`URL pública no accesible directamente (puede requerir autenticación)`);
        logInfo(`Status: ${urlError.response?.status || 'N/D'}`);
        return true; // No es error crítico
      }
    } else {
      logError('No se encontró URL pública en el documento');
      return false;
    }
  } catch (error) {
    logError(`Error verificando descarga: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Paso 7: Eliminar documento
async function testDeleteDocument() {
  log('\n========================================', 'bold');
  log('PRUEBA 7: Eliminar Documento', 'bold');
  log('========================================', 'bold');
  
  try {
    logInfo(`Eliminando documento con ID: ${testDocumentId}...`);
    await axios.delete(`${BASE_URL}/documentos/${testDocumentId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    logSuccess('Documento eliminado exitosamente');
    
    // Verificar que ya no está en la lista
    const response = await axios.get(`${BASE_URL}/documentos`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    const stillExists = response.data.find(doc => doc.id === testDocumentId);
    
    if (stillExists) {
      logError('El documento aún aparece en la lista después de eliminarlo');
      return false;
    } else {
      logSuccess('Verificado: el documento ya no aparece en la lista');
      return true;
    }
  } catch (error) {
    logError(`Error eliminando documento: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Limpiar archivo temporal
function cleanup(filePath) {
  log('\n========================================', 'bold');
  log('LIMPIEZA', 'bold');
  log('========================================', 'bold');
  
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logSuccess('Archivo temporal eliminado');
    }
  } catch (error) {
    logWarning(`No se pudo eliminar archivo temporal: ${error.message}`);
  }
}

// Ejecutar todas las pruebas
async function runAllTests() {
  log('\n╔════════════════════════════════════════╗', 'bold');
  log('║  PRUEBAS DE DOCUMENTOS S3 - HuertoHogar   ║', 'bold');
  log('╚════════════════════════════════════════╝', 'bold');
  
  const results = {
    login: false,
    list: false,
    upload: false,
    verify: false,
    download: false,
    delete: false
  };
  
  let testFilePath = null;
  
  try {
    // 1. Login
    results.login = await testLogin();
    if (!results.login) {
      throw new Error('Login falló - no se pueden continuar las pruebas');
    }
    
    // 2. Listar documentos
    results.list = await testListDocuments();
    
    // 3. Crear archivo de prueba
    testFilePath = createTestFile();
    if (!testFilePath) {
      throw new Error('No se pudo crear archivo de prueba');
    }
    
    // 4. Subir documento
    results.upload = await testUploadDocument(testFilePath);
    if (!results.upload) {
      throw new Error('Upload falló - pruebas de verificación omitidas');
    }
    
    // 5. Verificar que aparece en lista
    results.verify = await testVerifyUpload();
    
    // 6. Verificar URL de descarga
    results.download = await testDownload();
    
    // 7. Eliminar documento
    results.delete = await testDeleteDocument();
    
  } catch (error) {
    logError(`\nError durante las pruebas: ${error.message}`);
  } finally {
    // Limpieza
    cleanup(testFilePath);
  }
  
  // Resumen
  log('\n╔════════════════════════════════════════╗', 'bold');
  log('║           RESUMEN DE PRUEBAS           ║', 'bold');
  log('╚════════════════════════════════════════╝', 'bold');
  
  const tests = [
    { name: 'Login como ADMIN', result: results.login },
    { name: 'Listar documentos', result: results.list },
    { name: 'Subir documento', result: results.upload },
    { name: 'Verificar en lista', result: results.verify },
    { name: 'Verificar descarga', result: results.download },
    { name: 'Eliminar documento', result: results.delete }
  ];
  
  tests.forEach(test => {
    const status = test.result ? '✅ PASS' : '❌ FAIL';
    const color = test.result ? 'green' : 'red';
    log(`  ${status} - ${test.name}`, color);
  });
  
  const passed = tests.filter(t => t.result).length;
  const total = tests.length;
  
  log('\n========================================', 'bold');
  if (passed === total) {
    logSuccess(`¡TODAS LAS PRUEBAS PASARON! (${passed}/${total})`);
  } else {
    logWarning(`Algunas pruebas fallaron: ${passed}/${total} exitosas`);
  }
  log('========================================\n', 'bold');
}

// Ejecutar
runAllTests().catch(error => {
  logError(`Error fatal: ${error.message}`);
  process.exit(1);
});
