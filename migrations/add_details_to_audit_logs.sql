-- ============================================
-- MIGRATION : Ajouter colonne 'details' à audit_logs
-- Date : 2025-10-30
-- Description : Ajoute une colonne TEXT pour stocker
--               des descriptions lisibles des actions
-- ============================================

-- Vérifier si la colonne existe déjà
SET @exist := (SELECT COUNT(*) 
               FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'audit_logs' 
               AND COLUMN_NAME = 'details');

-- Ajouter la colonne si elle n'existe pas
SET @query = IF(@exist = 0,
  'ALTER TABLE audit_logs ADD COLUMN details TEXT NULL AFTER entity_id',
  'SELECT "Column details already exists" AS message');

PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Afficher la structure finale
DESCRIBE audit_logs;

-- Message de confirmation
SELECT 'Migration terminée avec succès !' AS status,
       'Colonne details ajoutée à audit_logs' AS message;

