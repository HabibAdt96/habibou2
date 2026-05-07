#!/bin/bash
# ═══════════════════════════════════════════════════════
#  HABIBOU — Script de démarrage Termux (proot Ubuntu)
#  Usage : bash start.sh
# ═══════════════════════════════════════════════════════

PROJET="$HOME/habibou2"   # ← Modifie si ton dossier est ailleurs

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║      HABIBOU — Démarrage du projet       ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ─── Vérifie que le dossier existe ─────────────────────
if [ ! -d "$PROJET" ]; then
  echo "❌ Dossier $PROJET introuvable"
  exit 1
fi

# ─── Tue les anciens processus Node.js ─────────────────
echo "🛑 Arrêt des anciens processus Node.js..."
pkill -f "node" 2>/dev/null || true
sleep 1

# ─── Lance le Backend (port 3000) dans tmux ou bg ──────
echo "🚀 Démarrage du backend (port 3000)..."
cd "$PROJET/backend"

# Installe les dépendances si node_modules absent
if [ ! -d "node_modules" ]; then
  echo "📦 Installation des dépendances backend..."
  npm install
fi

node src/server.js &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Attends que le backend soit prêt
sleep 3

# ─── Lance le Frontend Vite (port 5173) ────────────────
echo "🌐 Démarrage du frontend Vite (port 5173)..."
cd "$PROJET"

# Installe les dépendances si node_modules absent
if [ ! -d "node_modules" ]; then
  echo "📦 Installation des dépendances frontend..."
  npm install
fi

npm run frontend &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

sleep 2

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  ✅  HABIBOU est démarré !               ║"
echo "║                                          ║"
echo "║  🔗 Backend  → http://localhost:3000     ║"
echo "║  🌐 Frontend → http://localhost:5173     ║"
echo "║                                          ║"
echo "║  Pour vérifier le backend :              ║"
echo "║  curl http://localhost:3000/api/ping     ║"
echo "║                                          ║"
echo "║  Ctrl+C pour tout arrêter                ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Attend que les processus se terminent
wait $BACKEND_PID $FRONTEND_PID
