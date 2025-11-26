#!/bin/bash

# Script de prueba de API de Documentos
# Backend EC2: http://52.2.172.54:8080

API_BASE="http://52.2.172.54:8080/api"
DOCS_ENDPOINT="http://52.2.172.54:8080/documentos"

echo "🔐 1. Login para obtener token JWT..."
echo ""

# Reemplaza con credenciales de ADMIN reales
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@huertohogar.cl",
    "password": "admin123"
  }')

echo "Respuesta Login:"
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Extraer token (ajustar según la estructura del response)
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // .access_token // .jwt' 2>/dev/null)

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Error: No se pudo obtener el token. Verifica las credenciales."
  exit 1
fi

echo "✅ Token obtenido: ${TOKEN:0:20}..."
echo ""

# 2. Listar documentos
echo "📂 2. Listar documentos existentes..."
echo ""

curl -s -X GET "$DOCS_ENDPOINT" \
  -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || echo "Error al listar documentos"

echo ""
echo ""

# 3. Subir documento de prueba
echo "📤 3. Subir documento de prueba..."
echo ""

# Crear archivo de prueba si no existe
TEST_FILE="/tmp/test-doc-huertohogar.txt"
echo "Este es un documento de prueba para HuertoHogar - $(date)" > "$TEST_FILE"

UPLOAD_RESPONSE=$(curl -s -X POST "$DOCS_ENDPOINT" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@$TEST_FILE" \
  -F "tipoDocumento=OTRO" \
  -F "descripcion=Documento de prueba automatizada")

echo "Respuesta Upload:"
echo "$UPLOAD_RESPONSE" | jq '.' 2>/dev/null || echo "$UPLOAD_RESPONSE"
echo ""

# Extraer ID del documento recién subido
DOC_ID=$(echo "$UPLOAD_RESPONSE" | jq -r '.id' 2>/dev/null)

if [ "$DOC_ID" != "null" ] && [ -n "$DOC_ID" ]; then
  echo "✅ Documento subido con ID: $DOC_ID"
  echo ""
  
  # 4. Listar de nuevo para verificar
  echo "📂 4. Listar documentos (con el nuevo archivo)..."
  echo ""
  
  curl -s -X GET "$DOCS_ENDPOINT" \
    -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null
  
  echo ""
  echo ""
  
  # 5. Eliminar documento de prueba
  echo "🗑️  5. Eliminar documento de prueba..."
  echo ""
  
  DELETE_RESPONSE=$(curl -s -X DELETE "$DOCS_ENDPOINT/$DOC_ID" \
    -H "Authorization: Bearer $TOKEN")
  
  echo "Respuesta Delete:"
  echo "$DELETE_RESPONSE" | jq '.' 2>/dev/null || echo "$DELETE_RESPONSE"
  echo ""
  
  echo "✅ Prueba completada"
else
  echo "⚠️  No se pudo obtener el ID del documento subido"
fi

# Limpiar
rm -f "$TEST_FILE"

echo ""
echo "🏁 Script de pruebas finalizado"
