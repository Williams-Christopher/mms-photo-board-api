module.exports = {
    PORT: process.env.PORT || 8000,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || ['https://mms-photo-board.cwilliams.now.sh', 'http://localhost:3000', /(192\.168\.1\.)(([0-2][0-9]){0}([0-9])){1,3}/],
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DATABASE_URL || process.env.LOCAL_DB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY || '20s',
    BCRYPT_SALT: parseInt(process.env.BCRYPT_SALT),
    TWILIO_SID: process.env.TWILIO_SID,
    TWILIO_AUTH: process.env.TWILIO_AUTH,
    TWILIO_NUMBER: process.env.TWILIO_NUMBER,
    TWILIO_MYNUMBER: process.env.TWILIO_MYNUMBER,
}
