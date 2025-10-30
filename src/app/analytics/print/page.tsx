export default function PrintPage() {
  // Astuce simple : on réutilise la page en mode print si tu factorises plus tard.
  return (
    <div style={{ padding: 16 }}>
      <h1 style={{textAlign:'center'}}>Rapport mensuel</h1>
      <p style={{textAlign:'center', color:'#666'}}>Utilise Ctrl+P pour imprimer en PDF</p>
      {/* Tu pourras factoriser la logique dans un composant partagé si besoin */}
      <p>Ouvre /analytics et utilise l’impression du navigateur pour PDF.</p>
    </div>
  );
}






