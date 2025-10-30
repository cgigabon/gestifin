# 🔧 Migration Base de Données - Historique

## ❌ Problème Identifié

La table `audit_logs` existe mais avec une structure différente :

### Structure Actuelle (database-schema.sql)
```sql
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100),
  entity_id VARCHAR(100),
  meta JSON,                    -- ❌ Colonne JSON
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);
```

### Structure Attendue par le Code
```sql
CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100),
  entity_id VARCHAR(100),
  details TEXT,                 -- ✅ Colonne TEXT manquante
  meta JSON,                    -- ✅ Garder aussi meta pour flexibilité
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## ✅ Solution 1 : Migration SQL (RECOMMANDÉ)

### Étapes

1. **Ouvrir votre client MySQL** (HeidiSQL, MySQL Workbench, phpMyAdmin, etc.)

2. **Se connecter à votre base de données** `gestifin`

3. **Exécuter ce script SQL** :

```sql
-- Ajouter la colonne 'details' à audit_logs
ALTER TABLE audit_logs 
ADD COLUMN details TEXT NULL 
AFTER entity_id;

-- Vérifier que la colonne a été ajoutée
DESCRIBE audit_logs;
```

### Résultat Attendu
```
+------------+---------------+------+-----+-------------------+
| Field      | Type          | Null | Key | Default           |
+------------+---------------+------+-----+-------------------+
| id         | int(11)       | NO   | PRI | NULL              |
| user_id    | int(11)       | NO   | MUL | NULL              |
| action     | varchar(100)  | NO   |     | NULL              |
| entity     | varchar(100)  | YES  |     | NULL              |
| entity_id  | varchar(100)  | YES  |     | NULL              |
| details    | text          | YES  |     | NULL              | ← NOUVELLE
| meta       | json          | YES  |     | NULL              |
| created_at | timestamp     | NO   |     | CURRENT_TIMESTAMP |
+------------+---------------+------+-----+-------------------+
```

4. **Recharger votre application** (Ctrl+C puis `npm run dev`)

5. **Tester** : Aller sur http://localhost:3000/history

---

## 🔧 Solution 2 : Adapter le Code (Alternative)

Si vous préférez ne pas modifier la base de données, je peux adapter le code pour utiliser `meta` au lieu de `details`.

**Avantages** :
- ✅ Pas de migration SQL
- ✅ Utilise la structure existante

**Inconvénients** :
- ❌ `meta` est JSON, moins pratique pour du texte simple
- ❌ Nécessite de parser le JSON à chaque fois

---

## 🎯 Recommandation

**JE RECOMMANDE LA SOLUTION 1** car :

1. ✅ **Plus propre** : `details` pour du texte, `meta` pour du JSON structuré
2. ✅ **Plus performant** : Pas de parsing JSON à chaque lecture
3. ✅ **Plus flexible** : Garde `meta` pour des données complexes si besoin
4. ✅ **Plus lisible** : Les requêtes SQL sont plus simples

---

## 📋 Commandes Rapides

### Via MySQL CLI
```bash
mysql -u root -p gestifin < migrations/add_details_to_audit_logs.sql
```

### Via HeidiSQL
```
1. Ouvrir HeidiSQL
2. Se connecter à votre base 'gestifin'
3. Ouvrir l'onglet "Query"
4. Copier-coller le contenu de migrations/add_details_to_audit_logs.sql
5. Cliquer sur "Execute" (F9)
```

### Via phpMyAdmin
```
1. Se connecter à phpMyAdmin
2. Sélectionner la base 'gestifin'
3. Onglet "SQL"
4. Copier-coller le SQL
5. Cliquer "Exécuter"
```

---

## 🧪 Vérification Post-Migration

Après la migration, tester ces commandes SQL :

```sql
-- Vérifier la structure
DESCRIBE audit_logs;

-- Tester l'insertion
INSERT INTO audit_logs (user_id, action, entity, entity_id, details)
VALUES (1, 'test.action', 'test', '123', 'Test de la nouvelle colonne details');

-- Vérifier la lecture
SELECT * FROM audit_logs WHERE action = 'test.action';

-- Nettoyer le test
DELETE FROM audit_logs WHERE action = 'test.action';
```

---

## ✅ Checklist

- [ ] Migration SQL exécutée
- [ ] Colonne `details` présente dans la table
- [ ] Application redémarrée
- [ ] Page /history accessible
- [ ] Historique affiche les actions correctement

---

## 🆘 En Cas de Problème

### Erreur : "Column 'details' already exists"
```sql
-- La colonne existe déjà, rien à faire
SELECT 'OK' AS status;
```

### Erreur : "Access denied"
```sql
-- Vérifier les permissions de votre utilisateur MySQL
SHOW GRANTS FOR CURRENT_USER();
```

### Erreur persistante
```sql
-- Supprimer et recréer la table (ATTENTION : perte de données)
DROP TABLE IF EXISTS audit_logs;

CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100),
  entity_id VARCHAR(100),
  details TEXT,
  meta JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  INDEX idx_user_action (user_id, action),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 📊 Utilisation Future

Une fois la colonne ajoutée, les actions seront automatiquement enregistrées :

### Exemple d'enregistrement
```typescript
await pool.query(
  'INSERT INTO audit_logs (user_id, action, entity, entity_id, details) VALUES (?,?,?,?,?)',
  [userId, 'income.create', 'transaction', transactionId, 'Montant: 50000 XAF - Service: Tresses']
);
```

### Exemple de lecture
```typescript
const [logs] = await pool.query(
  'SELECT id, user_id, action, entity, entity_id, details, created_at FROM audit_logs WHERE user_id = ?',
  [userId]
);
```

---

## 🎉 Après la Migration

Une fois la migration effectuée, la page historique affichera :

✅ **Toutes les actions** depuis la création de l'application
✅ **Recherche** fonctionnelle
✅ **Filtres** opérationnels
✅ **Détails complets** pour chaque action

---

**💡 Conseil** : Exécutez la migration maintenant, puis rechargez votre application !

