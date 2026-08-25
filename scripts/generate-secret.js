const crypto = require('crypto');

console.log('JWT_ACCESS_SECRET=');
console.log(crypto.randomBytes(64).toString('hex'));

console.log();

console.log('JWT_REFRESH_SECRET=');
console.log(crypto.randomBytes(64).toString('hex'));
