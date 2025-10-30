-- ============================================
-- GESTIFIN - SCHÉMA DE BASE DE DONNÉES MySQL
-- ============================================

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS gestifin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestifin;

-- ============================================
-- TABLE: utilisateurs
-- ============================================
CREATE TABLE IF NOT EXISTS utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: services
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  nom VARCHAR(100) NOT NULL,
  actif TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  INDEX idx_user (utilisateur_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: enveloppes
-- ============================================
CREATE TABLE IF NOT EXISTS enveloppes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  nom VARCHAR(100) NOT NULL,
  budget_mensuel DECIMAL(15, 2) DEFAULT 0,
  pourcentage DECIMAL(5, 2) DEFAULT 0,
  protegee TINYINT(1) DEFAULT 0,
  solde_actuel DECIMAL(15, 2) DEFAULT 0,
  solde_initial DECIMAL(15, 2) DEFAULT 0,
  couleur VARCHAR(20) DEFAULT '#6B7280',
  icone VARCHAR(10) DEFAULT '📁',
  actif TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  INDEX idx_user (utilisateur_id),
  INDEX idx_actif (actif)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: transactions
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  type ENUM('ENTREE', 'SORTIE', 'TRANSFERT') NOT NULL,
  montant_total DECIMAL(15, 2) NOT NULL,
  description TEXT,
  service_id INT DEFAULT NULL,
  date_transaction DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
  INDEX idx_user_date (utilisateur_id, date_transaction),
  INDEX idx_type (type),
  INDEX idx_date (date_transaction)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: allocations
-- ============================================
CREATE TABLE IF NOT EXISTS allocations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id INT NOT NULL,
  enveloppe_id INT NOT NULL,
  montant DECIMAL(15, 2) NOT NULL,
  type_allocation VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
  FOREIGN KEY (enveloppe_id) REFERENCES enveloppes(id) ON DELETE CASCADE,
  INDEX idx_transaction (transaction_id),
  INDEX idx_enveloppe (enveloppe_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: alertes
-- ============================================
CREATE TABLE IF NOT EXISTS alertes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  type ENUM('CRITIQUE', 'ATTENTION', 'INFO') NOT NULL DEFAULT 'INFO',
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  lue TINYINT(1) DEFAULT 0,
  enveloppe_id INT DEFAULT NULL,
  transaction_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  FOREIGN KEY (enveloppe_id) REFERENCES enveloppes(id) ON DELETE SET NULL,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL,
  INDEX idx_user_lue (utilisateur_id, lue),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: audit_logs
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100),
  entity_id VARCHAR(100),
  meta JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  INDEX idx_user_action (user_id, action),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: revenue_configs
-- ============================================
CREATE TABLE IF NOT EXISTS revenue_configs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  montant DECIMAL(15, 2) NOT NULL,
  months_window INT DEFAULT 6,
  effective_from DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  INDEX idx_user_effective (utilisateur_id, effective_from)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: synchros_caisse
-- ============================================
CREATE TABLE IF NOT EXISTS synchros_caisse (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  date_synchro DATE NOT NULL,
  solde_physique DECIMAL(15, 2) NOT NULL,
  solde_calcule DECIMAL(15, 2) NOT NULL,
  ecart DECIMAL(15, 2) NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  INDEX idx_user_date (utilisateur_id, date_synchro),
  UNIQUE KEY uk_user_date (utilisateur_id, date_synchro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: transactions_allocations (vue compatibilité)
-- ============================================
-- Cette vue combine transactions et allocations pour compatibilité
CREATE OR REPLACE VIEW transactions_allocations AS
SELECT 
  a.id,
  a.transaction_id,
  a.enveloppe_id,
  a.montant,
  a.type_allocation,
  t.type,
  t.date_transaction,
  t.description,
  t.utilisateur_id
FROM allocations a
JOIN transactions t ON a.transaction_id = t.id;

-- ============================================
-- DONNÉES DE TEST (optionnel)
-- ============================================

-- Insérer un utilisateur de test (mot de passe: "password123")
-- INSERT INTO utilisateurs (nom, email, password_hash) VALUES 
-- ('Test User', 'test@gestifin.com', '$2a$10$YourHashedPasswordHere');

-- ============================================
-- FIN DU SCHÉMA
-- ============================================

-- Afficher toutes les tables créées
SHOW TABLES;

SELECT 'Schéma GestiFin créé avec succès!' AS Status;

