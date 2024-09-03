import express from 'express';
import dotenv from 'dotenv'; // dotenv 모듈 가져오기
import ImageKit from "imagekit"; // ImageKit 모듈 가져오기
import cors from "cors";
import mongoose from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'

dotenv.config(); // .env 파일의 환경 변수 로드

const port = process.env.PORT || 3000; // 환경 변수 PORT 설정되어 있지 않으면 3000 사용
const app = express(); // Express 애플리케이션 인스턴스 생성

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true, // CORS 요청에 쿠키를 포함하도록 설정
    })
);

app.use(express.json());

// Mongoose
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log(err);
    }
};


const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT, // ImageKit URL 엔드포인트
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY, // ImageKit 공개 키
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY, // ImageKit 비공개 키
});

// "/api/upload" 경로에 대한 GET 요청 처리
app.get("/api/upload", (req, res) => {
    const result = imagekit.getAuthenticationParameters(); // 인증 매개변수 가져오기
    res.send(result); // 클라이언트에 결과 전송
});

{/*
// https://clerk.com/docs/backend-requests/handling/nodejs
app.get("/api/test", ClerkExpressRequireAuth(), (req, res) => {
    const userId = req.auth.userId;
    console.log(userId);
    res.send("Success!");
});
*/}

app.post("/api/chats", ClerkExpressRequireAuth(),
    async (req, res) => {
    const userId = req.auth.userId;
    const {text} = req.body
    try{
        // CREATE A NEW CHAT
        const newChat = new Chat({
            userId: userId,
            history: [{ role: "user", parts: [{ text }] }],
        });

        const savedChat = await newChat.save();

        // CHECK IF THE USERCHATS EXISTS
        const userChats = await UserChats.find({userId: userId});

        // IF IT DOESN'T EXIST CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
        if (!userChats.length) {
            const newUserChats = new UserChats({
                userId: userId,
                chats: [
                    {
                        _id: savedChat._id,
                        title: text.substring(0, 40),
                    },
                ],
            });

            await newUserChats.save();
        } else {
            // IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
            await UserChats.updateOne({ userId: userId }, {
                    $push: {
                        chats: {
                            _id: savedChat._id,
                            title: text.substring(0, 40),
                        },
                    },
                }
            );

            res.status(201).send(newChat._id);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating chat!");
    }
});

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;

    try {
        const userChats = await UserChats.find({ userId });

        res.status(200).send(userChats[0].chats);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching userchats!");
    }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;

    try {
        const chat = await Chat.findOne({ _id: req.params.id, userId });

        res.status(200).send(chat);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching chat!");
    }
});

// Answer AI
app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;

    const { question, answer, img } = req.body;

    const newItems = [
        ...(question
            ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
            : []),
        { role: "model", parts: [{ text: answer }] },
    ];

    try {
        const updatedChat = await Chat.updateOne(
            { _id: req.params.id, userId },
            {
                $push: {
                    history: {
                        $each: newItems,
                    },
                },
            }
        );
        res.status(200).send(updatedChat);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding conversation!");
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(401).send("Unauthenticated!");
});


// 지정된 포트에서 서버 시작
app.listen(port, () => {
    connect() // 잘 연결되면 "connected to MongoDB" 메세지 나옴.
    console.log(`Server running on ${port}`); // 서버 실행 중 메시지 출력
});
