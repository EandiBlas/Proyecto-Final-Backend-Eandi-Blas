import dotenv from "dotenv"

dotenv.config()

export default {
    port: process.env.PORT,
    mongo_uri: process.env.MONGO_URI,
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
    github_url_callback: process.env.GITHUB_URL_CALLBACK,
    session_secret: process.env.SESSION_SECRET,
    environment: process.env.ENVIRONMENT,
    gmail_user: process.env.GMAIL_USER,
    gmail_password: process.env.GMAIL_PASSWORD,
};