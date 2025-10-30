# 🔧 Configuration de la Base de Données - GestiFin

## ❌ Problème Rencontré

L'erreur **"Table 'gestifin.enveloppes' doesn't exist"** signifie que les tables de la base de données MySQL n'ont pas encore été créées.

---

## ✅ Solution : Créer les Tables

### Méthode 1 : Via MySQL Command Line (Recommandé)

#### Étape 1 : Ouvrir MySQL
```bash
# Sur Windows (PowerShell)
mysql -u root -p

# OU si vous avez un mot de passe
mysql -u root -p votremotdepasse
```

#### Étape 2 : Exécuter le Script SQL
```sql
-- Dans la console MySQL
source C:/Users/BC241/Music/gestifin/database-schema.sql

-- OU copier-coller le contenu du fichier
```

#### Étape 3 : Vérifier
```sql
USE gestifin;
SHOW TABLES;

-- Vous devriez voir :
-- +------------------------+
-- | Tables_in_gestifin     |
-- +------------------------+
-- | alertes                |
-- | allocations            |
-- | audit_logs             |
-- | enveloppes             |
-- | revenue_configs        |
-- | services               |
-- | synchros_caisse        |
-- | transactions           |
-- | utilisateurs           |
-- +------------------------+
```

---

### Méthode 2 : Via MySQL Workbench (Interface Graphique)

1. **Ouvrir MySQL Workbench**
2. **Connexion** à votre serveur MySQL local
3. **File** → **Open SQL Script**
4. **Sélectionner** `database-schema.sql`
5. **Cliquer** sur l'icône éclair ⚡ pour exécuter
6. **Vérifier** que toutes les tables sont créées

---

### Méthode 3 : Via phpMyAdmin

1. **Ouvrir phpMyAdmin** (`http://localhost/phpmyadmin`)
2. **Sélectionner** la base de données `gestifin` (ou la créer)
3. **Onglet SQL**
4. **Copier-coller** le contenu de `database-schema.sql`
5. **Cliquer** sur "Exécuter"

---

## 📋 Structure de la Base de Données

### Tables Créées

| Table | Description |
|-------|-------------|
| **utilisateurs** | Comptes utilisateurs |
| **enveloppes** | Enveloppes budgétaires |
| **transactions** | Toutes les transactions (ENTREE/SORTIE/TRANSFERT) |
| **allocations** | Liens entre transactions et enveloppes |
| **services** | Sources de revenus |
| **alertes** | Notifications utilisateur |
| **audit_logs** | Historique des actions |
| **revenue_configs** | Configuration baseline revenus |
| **synchros_caisse** | Rapprochements caisse |

---

## 🔑 Colonnes Importantes

### Table `enveloppes`
```sql
id                INT (Primary Key)
utilisateur_id    INT (Foreign Key → utilisateurs)
nom               VARCHAR(100)
budget_mensuel    DECIMAL(15,2)
pourcentage       DECIMAL(5,2)
protegee          TINYINT(1)
solde_actuel      DECIMAL(15,2)
solde_initial     DECIMAL(15,2)
couleur           VARCHAR(20)
icone             VARCHAR(10)
actif             TINYINT(1)
```

### Table `transactions`
```sql
id                INT (Primary Key)
utilisateur_id    INT (Foreign Key → utilisateurs)
type              ENUM('ENTREE', 'SORTIE', 'TRANSFERT')
montant_total     DECIMAL(15,2)
description       TEXT
service_id        INT (Foreign Key → services)
date_transaction  DATE
```

---

## 🎯 Créer un Utilisateur de Test

Après avoir créé les tables, vous pouvez créer un compte :

### Option 1 : Via l'Interface Web
```
http://localhost:3000/auth/register
```
- Nom : Votre nom
- Email : votre@email.com
- Mot de passe : (minimum 6 caractères)

### Option 2 : Via SQL Direct
```sql
-- Mot de passe: "password123" (hashé avec bcrypt)
INSERT INTO utilisateurs (nom, email, password_hash) VALUES 
('Test User', 'test@gestifin.com', '$2a$10$rOQ7LJVDJYr8F7Qjz.ZuXOQxBfVYX7YbN7nX7kVwJ7X7X7X7X7X7X');
```

---

## 🚀 Relancer l'Application

Après avoir créé les tables :

```powershell
# Arrêter le serveur (Ctrl + C)
# Relancer
pnpm run dev
```

---

## ✅ Vérification

### Test 1 : Page de connexion
```
http://localhost:3000/auth/login
```
✅ Devrait fonctionner

### Test 2 : Créer un compte
```
http://localhost:3000/auth/register
```
✅ Devrait créer un utilisateur

### Test 3 : Configuration initiale
Après connexion, vous serez redirigé vers :
```
http://localhost:3000/onboarding
```
✅ Créez vos premières enveloppes

### Test 4 : Dashboard
```
http://localhost:3000/dashboard
```
✅ Devrait afficher vos enveloppes

---

## 🔧 Dépannage

### Erreur : "Access denied for user"
```bash
# Vérifier vos credentials MySQL
# Fichier : .env.local

MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=votremotdepasse
MYSQL_DB=gestifin
```

### Erreur : "Unknown database 'gestifin'"
```sql
-- Créer la base de données manuellement
CREATE DATABASE gestifin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Erreur : "Table already exists"
```sql
-- Supprimer toutes les tables (ATTENTION : perte de données)
DROP DATABASE IF EXISTS gestifin;
CREATE DATABASE gestifin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Puis relancer le script database-schema.sql
```

---

## 📊 Données de Test (Optionnel)

Si vous voulez tester avec des données :

```
http://localhost:3000/api/seed
```

**Note :** Vous devez être connecté pour utiliser l'API seed.

---

## 🎉 C'est Prêt !

Une fois les tables créées :
1. ✅ Créez un compte utilisateur
2. ✅ Configurez vos enveloppes (onboarding)
3. ✅ Commencez à utiliser GestiFin !

---

## 📞 Support

Si vous rencontrez toujours des problèmes :
1. Vérifiez que MySQL est bien démarré
2. Vérifiez vos credentials dans `.env.local`
3. Vérifiez que toutes les tables sont créées (`SHOW TABLES;`)
4. Vérifiez les logs de l'application

---

**Bon courage ! 🚀**

