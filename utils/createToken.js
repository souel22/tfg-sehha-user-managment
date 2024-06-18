const jwt = require('jsonwebtoken');

// Create a token
const createToken = (payload, privateKey, passphrase, exp) => {
    return jwt.sign(payload, { key: privateKey, passphrase }, {
        algorithm: 'RS256',
        expiresIn: exp
    });
}

module.exports = createToken;