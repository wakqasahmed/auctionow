'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  secure: {
    ssl: Boolean(process.env.ssl) || false,
    privateKey: './config/sslcerts/key.pem',
    certificate: './config/sslcerts/cert.pem'
  },
  db: {
    name: process.env.DB_NAME || "seanjs_dev",
    host: process.env.OPENSHIFT_POSTGRESQL_DB_HOST || process.env.DB_HOST || "localhost",
    port: process.env.OPENSHIFT_POSTGRESQL_DB_PORT || process.env.DB_PORT || 5432,
    username: process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME || process.env.DB_USERNAME || "postgres",
    password: process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD || process.env.DB_PASSWORD || "postgres",
    dialect: process.env.DB_DIALECT || "postgres", //mysql, postgres, sqlite3,...
    enableSequelizeLog: process.env.DB_LOG || false,
    ssl: process.env.DB_SSL || false,
    sync: process.env.DB_SYNC || false, //Synchronizing any model changes with database
    "pool": {
      "maxConnections": 100,
      "maxIdleTime": 1000
    }
  },
  redis: {
    host: process.env.OPENSHIFT_REDIS_HOST ||  "ec2-54-83-207-91.compute-1.amazonaws.com" || process.env.REDIS_HOST || "localhost",
    port: process.env.OPENSHIFT_REDIS_PORT ||  18059 || process.env.REDIS_PORT || 6379,
    database: parseInt(process.env.REDIS_DATABASE) || 0,
    password: process.env.REDIS_PASSWORD || "pdhtkg8fniaep87u0p5e1uenvoj" || "",
    configFrom: "Development Waqas"
  },
  log: {
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    // Stream defaults to process.stdout
    // Uncomment to enable logging to a log on the file system
    options: {
      //stream: 'access.log'
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: true
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  },
  livereload: false
};
