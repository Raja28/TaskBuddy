const { OAuth2Client } = require('google-auth-library');
require("dotenv").config()


const admin = require('firebase-admin')
// const credential = JSON.parse(process.env.FIREBASE_CREDENTIALS)

const User = require('../models/user');
const Task = require('../models/task');
const { json } = require('express');


exports.auth = async (req, res) => {

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

        const token = req.body.token || req.header("Authorization").replace("Bearer ", "")

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token missing"
            })
        }

        try {
            const tokenData = await admin.auth().verifyIdToken(token)
            const { email, picture, uid, } = tokenData

            const isUserExist = await User.findOne({ 'email': email }).populate('tasks')

            if (isUserExist) {
                // const tasks = await Task.find({}).populate('tasks')

                return res.status(200).json({
                    success: true,
                    message: 'User exist',
                    user: isUserExist,
                    accessToken: token
                })
            }

            const newUser = await User.create({
                name: email.split("@")[0],
                email,
                picture,
                uid
            })

            if (newUser) {
                res.status(201).json({
                    success: true,
                    message: "User signup successful",
                    user: newUser,
                    accessToken: token
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: "Something went wrong",

                })
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to verify user, Try again."
            })
        }

        // console.log(tokenData);

        // const ticket = await client.verifyIdToken({
        //     idToken: token,
        //     audience: process.env.GOOGLE_CLIENT_ID, 
        // });

        // const payload = ticket.getPayload()

        // console.log(payload);

        // res.status(200).json({
        //     success: true,
        //     message: "mission successful" 
        // })

    } catch (error) {
        console.log("auth", error);
        res.status(400).json({
            success: false,
            message: "Internal server error"
        })

    }
}