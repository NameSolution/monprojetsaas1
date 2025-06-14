
#!/bin/bash

echo "=========================================="
echo "   HotelBot AI SaaS - Setup Automatique"
echo "=========================================="
echo

echo "[1/4] Installation des dépendances..."
npm install
if [ $? -ne 0 ]; then
    echo "ERREUR: Installation des dépendances échouée"
    exit 1
fi

echo
echo "[2/4] Configuration de la base de données..."
echo "Assurez-vous que PostgreSQL est lancé et que les paramètres de connexion sont corrects dans server/db.cjs"

echo
echo "[3/4] Initialisation de la base de données..."
node server/seed.cjs
if [ $? -ne 0 ]; then
    echo "AVERTISSEMENT: Initialisation de la BD échouée - continuons..."
fi

echo
echo "[4/4] Build du projet..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERREUR: Build échoué"
    exit 1
fi

echo
echo "=========================================="
echo "   INSTALLATION TERMINÉE !"
echo "=========================================="
echo
echo "Pour démarrer le serveur : node index.cjs"
echo
echo "Comptes de test :"
echo "- Super Admin : pass@passhoteltest.com / pass"
echo "- Admin Hôtel : admin@example.com / password"
echo
