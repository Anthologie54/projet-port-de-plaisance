const bcrypt = require('bcrypt');

const password = 'monMotDePasse123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    return console.error('Erreur hash:', err);
  }
  console.log('Hash généré:', hash);

  bcrypt.compare(password, hash, (err, result) => {
    if (err) {
      return console.error('Erreur compare:', err);
    }
    console.log('Résultat comparaison:', result); // devrait être true
  });
});