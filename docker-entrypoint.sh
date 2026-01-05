#!/bin/sh
# Docker entrypoint script to inject environment variables at runtime
# This replaces placeholder values in JS files with actual environment variables

set -e

# Directory containing the built files
BUILD_DIR="/usr/share/nginx/html"

echo "🚀 Starting Riwi Jobs Frontend..."

# Replace environment variables in runtime-env.js if it exists
if [ -f "$BUILD_DIR/runtime-env.js" ]; then
    echo "📝 Injecting environment variables..."
    
    # Create runtime configuration
    cat > "$BUILD_DIR/runtime-env.js" <<EOF
window._env_ = {
  VITE_API_URL: "${VITE_API_URL:-https://riwi-jobs-production.up.railway.app}",
  VITE_API_KEY: "${VITE_API_KEY:-angelica-secure-api-key-2026}"
};
EOF
    
    echo "✅ Environment variables injected successfully"
else
    # Create the file if it doesn't exist
    cat > "$BUILD_DIR/runtime-env.js" <<EOF
window._env_ = {
  VITE_API_URL: "${VITE_API_URL:-https://riwi-jobs-production.up.railway.app}",
  VITE_API_KEY: "${VITE_API_KEY:-angelica-secure-api-key-2026}"
};
EOF
fi

# Inject script reference into index.html if not already present
if ! grep -q "runtime-env.js" "$BUILD_DIR/index.html"; then
    echo "📝 Adding runtime-env.js to index.html..."
    sed -i 's|<head>|<head><script src="/runtime-env.js"></script>|' "$BUILD_DIR/index.html"
fi

echo "🎉 Frontend ready!"
echo "📡 API URL: ${VITE_API_URL:-https://riwi-jobs-production.up.railway.app}"

# Execute the CMD
exec "$@"
