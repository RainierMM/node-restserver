/**
 * PUERTO
 */

process.env.PORT = process.env.PORT || 3000;

/**
 * Entorno
 */

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

/**
 * Vencimiento del token
 * 60 segundos
 * 60 minutos
 * 24 horas
 * 30 dias
 */

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

/**
 * Seed (Semilla de autenticacion)
 */

process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";

/**
 * BASE DE DATOS
 */

let urlDB;

if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/cafe";
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

/**
 * Google Client ID
 */

process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "222087435349-36cumrmn9ksbndsse8i7eri9g95p3p02.apps.googleusercontent.com";
