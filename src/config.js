module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY || '20s',
    BCRYPT_SALT: process.env.BCRYPT_SALT,
    TWILIO_SID: process.env.TWILIO_SID,
    TWILIO_AUTH: process.env.TWILIO_AUTH,
    TWILIO_NUMBER: process.env.TWILIO_NUMBER,
    TWILIO_MYNUMBER: process.env.TWILIO_NUMBER,
}
