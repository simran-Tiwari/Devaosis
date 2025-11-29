// src/environment.js


const IS_PROD = true;

// Base server URL
const server = IS_PROD
  ? "https://devaosisbackend.onrender.com" 
  : "http://localhost:3000"; 

export default server;
