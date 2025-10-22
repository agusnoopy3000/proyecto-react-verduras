#!/bin/bash
set -e
cd "$(dirname "$0")"

# Buscar archivos que contienen el header local (excluye el componente global)
files=$(grep -RIl '<header className="site"' src | grep -v '^src/components/Header.jsx$' || true)

if [ -z "$files" ]; then
  echo "No se encontraron headers locales para eliminar."
  exit 0
fi

echo "Archivos a parchear:"
echo "$files"
echo

# Hacer backup (.bak) y eliminar el bloque header (multiline) con perl
for f in $files; do
  echo "Backup -> ${f}.bak"
  cp "$f" "${f}.bak"
  perl -0777 -pe 's/<header\s+className="site">.*?<\/header>\s*//gs' -i "$f"
  echo "Patcheado: $f"
done

echo
echo "Listo. Reinicia Vite si es necesario: npm run dev"
