#!/bin/bash
set -e

if [ ! -f "node_modules/.package-json-hash" ] || [ "package.json" -nt "node_modules/.package-json-hash" ]; then
    echo "📦 Instalando dependências..."
    npm install
    cp package.json node_modules/.package-json-hash
else
    echo "node_modules atualizado, pulando npm install"
fi

exec npm run dev -- --host 0.0.0.0
