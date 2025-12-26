// hash.js
const bcrypt = require('bcrypt');

// The plain text password you want to hash
const password = 'admin12'; // <-- change this to your password

// Generate hash
async function generateHash() {
    try {
        const saltRounds = 10; // recommended
        const hash = await bcrypt.hash(password, saltRounds);
        console.log("Plain Password:", password);
        console.log("Hashed Password:", hash);
    } catch (error) {
        console.error("Error hashing password:", error);
    }
}

generateHash();
