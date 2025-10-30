-- ============================================
-- MIGRATION SIMPLE : Ajouter colonne 'details'
-- ============================================

-- Ajouter la colonne 'details' après 'entity_id'
ALTER TABLE audit_logs 
ADD COLUMN details TEXT NULL 
AFTER entity_id;

-- Vérifier que c'est bien ajouté
DESCRIBE audit_logs;

-- Message de confirmation
SELECT '✅ Migration terminée avec succès !' AS message;

