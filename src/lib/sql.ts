// src/lib/sql.ts
export const SQL = {
  // Utilisateurs
  findUserByEmail:
    'SELECT id, nom, email, password_hash FROM utilisateurs WHERE email = ? LIMIT 1',
  insertUser:
    'INSERT INTO utilisateurs (nom, email, password_hash) VALUES (?, ?, ?)',

  // Enveloppes
  listActiveEnvelopes:
    'SELECT id, pourcentage, protegee FROM enveloppes WHERE utilisateur_id = ? ORDER BY id',
  updateEnvelopeBalance:
    'UPDATE enveloppes SET solde_actuel = solde_actuel + ? WHERE id = ?',

  // Transactions & allocations
  insertTransaction:
    'INSERT INTO transactions (utilisateur_id, type, montant_total, description, service_id, date_transaction) VALUES (?,?,?,?,?,?)',
  insertAllocation:
    'INSERT INTO allocations (transaction_id, enveloppe_id, montant, type_allocation) VALUES (?,?,?,?)',

  // Services
  listUserServices:
    'SELECT id, nom FROM services WHERE utilisateur_id = ? AND actif = 1 ORDER BY nom',

  // Enveloppes (pour formulaire dépenses)
  listUserEnvelopesForSpending:
    'SELECT id, nom, solde_actuel, budget_mensuel, protegee FROM enveloppes WHERE utilisateur_id = ? ORDER BY nom',

  // Dashboard
  envelopesSummary:
    `SELECT id, nom, budget_mensuel, solde_actuel,
      CASE WHEN budget_mensuel > 0 THEN ROUND((budget_mensuel - solde_actuel)/budget_mensuel*100) ELSE 0 END AS pct_utilise
     FROM enveloppes WHERE utilisateur_id = ? ORDER BY nom`,
  recentTransactions:
    `SELECT t.id, t.type, t.montant_total, t.description, t.date_transaction
     FROM transactions t
     WHERE t.utilisateur_id = ?
     ORDER BY t.date_transaction DESC, t.id DESC
     LIMIT 10`,

  // Envelope detail
  envelopeById:
    'SELECT id, nom, budget_mensuel, solde_actuel, pourcentage, protegee FROM enveloppes WHERE utilisateur_id=? AND id=? LIMIT 1',
  envelopeTransactions:
    `SELECT t.id, t.type, t.montant_total, t.description, t.date_transaction, a.montant AS allocation_montant
     FROM transactions t
     JOIN allocations a ON a.transaction_id = t.id
     WHERE t.utilisateur_id=? AND a.enveloppe_id=?
     ORDER BY t.date_transaction DESC, t.id DESC
     LIMIT ? OFFSET ?`,
  countEnvelopeTransactions:
    `SELECT COUNT(*) AS n
     FROM transactions t
     JOIN allocations a ON a.transaction_id = t.id
     WHERE t.utilisateur_id=? AND a.enveloppe_id=?`,

  // Transactions listing/deletion
  listUserTransactions:
    `SELECT id, type, montant_total, description, date_transaction
     FROM transactions
     WHERE utilisateur_id=?
     ORDER BY date_transaction DESC, id DESC
     LIMIT ? OFFSET ?`,
  countUserTransactions:
    'SELECT COUNT(*) AS n FROM transactions WHERE utilisateur_id=?',
  allocationsByTransaction:
    'SELECT enveloppe_id, montant, type_allocation FROM allocations WHERE transaction_id=?',
  deleteAllocationsByTx:
    'DELETE FROM allocations WHERE transaction_id=?',
  deleteTransactionById:
    'DELETE FROM transactions WHERE id=? AND utilisateur_id=?',

  // Agrégats mensuels (par mois AAAA-MM)
  monthlyOverview:
    `SELECT
       DATE_FORMAT(date_transaction, '%Y-%m') AS ym,
       SUM(CASE WHEN type='ENTREE' THEN montant_total ELSE 0 END) AS revenus,
       SUM(CASE WHEN type='SORTIE' THEN montant_total ELSE 0 END) AS depenses
     FROM transactions
     WHERE utilisateur_id=? AND date_transaction BETWEEN ? AND ?
     GROUP BY ym
     ORDER BY ym`,

  monthlyByEnvelope:
    `SELECT
       e.id, e.nom,
       SUM(CASE WHEN t.type='ENTREE' THEN a.montant ELSE 0 END) AS entrees,
       SUM(CASE WHEN t.type='SORTIE' THEN a.montant ELSE 0 END) AS sorties
     FROM enveloppes e
     LEFT JOIN allocations a ON a.enveloppe_id = e.id
     LEFT JOIN transactions t ON t.id = a.transaction_id
     WHERE e.utilisateur_id=? AND t.date_transaction BETWEEN ? AND ?
     GROUP BY e.id, e.nom
     ORDER BY e.nom`,

  prevMonthTotals:
    `SELECT
       SUM(CASE WHEN type='ENTREE' THEN montant_total ELSE 0 END) AS revenus,
       SUM(CASE WHEN type='SORTIE' THEN montant_total ELSE 0 END) AS depenses
     FROM transactions
     WHERE utilisateur_id=? AND date_transaction BETWEEN ? AND ?`,

  hasMonthClosure:
    `SELECT id
     FROM audit_logs
     WHERE user_id=? AND action='month.close'
       AND JSON_EXTRACT(meta,'$.ym') = ? 
     LIMIT 1`,

  // Budget settings helpers
  listActiveEnvelopesSimple:
    'SELECT id, nom, budget_mensuel, pourcentage, protegee FROM enveloppes WHERE utilisateur_id=? AND actif=1 ORDER BY nom',

  // Totaux de dépenses par enveloppe (toutes périodes)
  envelopesExpensesTotals:
    `SELECT a.enveloppe_id AS id, COALESCE(SUM(CASE WHEN t.type='SORTIE' THEN a.montant ELSE 0 END),0) AS depenses
     FROM allocations a
     JOIN transactions t ON t.id=a.transaction_id
     WHERE t.utilisateur_id=?
     GROUP BY a.enveloppe_id`,
  envelopeTotalExpenses:
    `SELECT COALESCE(SUM(CASE WHEN t.type='SORTIE' THEN a.montant ELSE 0 END),0) AS depenses
     FROM allocations a
     JOIN transactions t ON t.id=a.transaction_id
     WHERE t.utilisateur_id=? AND a.enveloppe_id=?`,

  // Agrégats mensuels pour une enveloppe (6 derniers mois)
  envelopeMonthlyAggregates:
    `SELECT DATE_FORMAT(t.date_transaction,'%Y-%m') AS ym,
            SUM(CASE WHEN t.type='ENTREE' THEN a.montant ELSE 0 END) AS entrees,
            SUM(CASE WHEN t.type='SORTIE' THEN a.montant ELSE 0 END) AS sorties
     FROM allocations a
     JOIN transactions t ON t.id=a.transaction_id
     WHERE t.utilisateur_id=? AND a.enveloppe_id=? AND t.date_transaction BETWEEN ? AND ?
     GROUP BY ym
     ORDER BY ym`,

  // ALERTES
  insertAlert:
    'INSERT INTO alertes (utilisateur_id, type, titre, description, enveloppe_id, transaction_id, lue) VALUES (?,?,?,?,?,?,0)',
  listAlerts:
    'SELECT id, type, titre, description, enveloppe_id, transaction_id, created_at, lue FROM alertes WHERE utilisateur_id=? ORDER BY created_at DESC LIMIT 50',
  markAlertRead:
    'UPDATE alertes SET lue=1 WHERE utilisateur_id=? AND id=?',

  // SYNC CAISSE
  listSyncHistory:
    'SELECT date_synchro, cash_declare, net_calcule, ecart FROM synchronisations WHERE utilisateur_id=? ORDER BY date_synchro DESC LIMIT 30',

  // Synchro quotidienne
  selectDayTotals: `
    SELECT
      SUM(CASE WHEN type='ENTREE' THEN montant_total ELSE 0 END) AS total_entrees,
      SUM(CASE WHEN type='SORTIE' THEN montant_total ELSE 0 END) AS total_depenses
    FROM transactions
    WHERE utilisateur_id = ? AND date_transaction = ?`,
  upsertSync: `
    INSERT INTO synchronisations (utilisateur_id, date_synchro, cash_declare, net_calcule, ecart)
    VALUES (?,?,?,?,?)
    ON DUPLICATE KEY UPDATE
      cash_declare=VALUES(cash_declare),
      net_calcule=VALUES(net_calcule),
      ecart=VALUES(ecart)`,

  // Audit
  audit:
    'INSERT INTO audit_logs (user_id, action, entity, entity_id, meta) VALUES (?,?,?,?,?)',
  auditWithDetails:
    'INSERT INTO audit_logs (user_id, action, entity, entity_id, details, meta) VALUES (?,?,?,?,?,?)',
};
