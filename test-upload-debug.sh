#!/bin/bash

# Script de debug para subida de documentos
# Prueba directa al backend EC2

API_BASE="http://52.2.172.54:8080/api"
DOCS_ENDPOINT="http://52.2.172.54:8080/documentos"

echo "🔐 Paso 1: Obtener token JWT..."
echo ""

# Intenta login (ajusta credenciales si es necesario)
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@huertohogar.cl",
    "password": "admin123"
  }')

echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Extraer token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // .access_token // .jwt // .accessToken' 2>/dev/null)

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "⚠️  No se pudo obtener token. Intentando sin autenticación..."
  echo ""
  TOKEN=""
fi

# Crear archivo de prueba pequeño
TEST_FILE="/tmp/test-huertohogar.txt"
echo "Documento de prueba HuertoHogar - $(date)" > "$TEST_FILE"

echo "📤 Paso 2: Subir archivo de prueba..."
echo "Archivo: $TEST_FILE ($(wc -c < "$TEST_FILE") bytes)"
echo ""

if [ -n "$TOKEN" ]; then
  echo "🔑 Usando token JWT"
  echo ""
  
  # Con autenticación
  curl -v -X POST "$DOCS_ENDPOINT" \
    -H "Authorization: Bearer $TOKEN" \
    -F "file=@$TEST_FILE" \
    -F "tipoDocumento=OTRO" \
    -F "descripcion=Test desde script" \
    2>&1 | grep -E "HTTP/|< |> |{|}"
else
  echo "🔓 Sin autenticación (puede fallar)"
  echo ""
  
  # Sin autenticación
  curl -v -X POST "$DOCS_ENDPOINT" \
    -F "file=@$TEST_FILE" \
    -F "tipoDocumento=OTRO" \
    -F "descripcion=Test desde script" \
    2>&1 | grep -E "HTTP/|< |> |{|}"
fi

echo ""
echo ""
echo "🔍 Paso 3: Verificar respuesta completa..."
echo ""

if [ -n "$TOKEN" ]; then
  curl -s -X POST "$DOCS_ENDPOINT" \
    -H "Authorization: Bearer $TOKEN" \
    -F "file=@$TEST_FILE" \
    -F "tipoDocumento=OTRO" \
    -F "descripcion=Test desde script" \
    2>&1 | jq '.' 2>/dev/null || curl -s -X POST "$DOCS_ENDPOINT" \
    -H "Authorization: Bearer $TOKEN" \
    -F "file=@$TEST_FILE" \
    -F "tipoDocumento=OTRO" \
    -F "descripcion=Test desde script"
fi

# Limpiar
rm -f "$TEST_FILE"

echo ""
echo "🏁 Script de debug finalizado"
