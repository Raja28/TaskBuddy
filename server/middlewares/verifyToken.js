const { OAuth2Client } = require('google-auth-library');
require("dotenv").config()

const admin = require('firebase-admin')
// const credential = require('../firebase_credentials.json') || JSON.parse(JSON.parse(process.env.FIREBASE_CREDENTIALS))
//  credential =  process.env.FIREBASE_CREDENTIALS
const User = require('../models/user');
const Task = require('../models/task');

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.body.token || req.header('Authorization').replace('Bearer ', "")

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token missing'
            })
        }

        const credential = {
            "type": "service_account",
            "project_id": process.env.FIREBASE_PROJECT_ID,
            "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
            "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            "client_email": process.env.FIREBASE_CLIENT_EMAIL,
            "client_id": process.env.FIREBASE_CLIENT_ID,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
            "universe_domain": "googleapis.com"
        }

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(credential)
            })
        }

        try {

            const tokenData = await admin.auth().verifyIdToken(token)
            const { email, picture, uid } = tokenData

            const user = await User.findOne({ 'email': email })

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "User not found"
                })
            }

            const userData = {
                _id: user._id,
                email
            }

            req.user = userData

            next();
        } catch (error) {
            console.log(error);

            res.status(400).json({
                success: false,
                message: "Unauthorized"
            })
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })

    }
}