
@echo off
echo ==========================================
echo    HotelBot AI SaaS - Setup Automatique
echo ==========================================
echo.

echo [1/4] Installation des dependances...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Installation des dependances echouee
    pause
    exit /b 1
)

echo.
echo [2/4] Configuration de la base de donnees...
echo Assurez-vous que PostgreSQL est lance et que les parametres de connexion sont corrects dans server/db.cjs

echo.
echo [3/4] Initialisation de la base de donnees...
node server/seed.cjs
if %ERRORLEVEL% NEQ 0 (
    echo AVERTISSEMENT: Initialisation de la BD echouee - continuons...
)

echo.
echo [4/4] Build du projet...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Build echoue
    pause
    exit /b 1
)

echo.
echo ==========================================
echo    INSTALLATION TERMINEE !
echo ==========================================
echo.
echo Pour demarrer le serveur : node index.cjs
echo.
echo Comptes de test :
echo - Super Admin : pass@passhoteltest.com / pass
echo - Admin Hotel : admin@example.com / password
echo.
pause
