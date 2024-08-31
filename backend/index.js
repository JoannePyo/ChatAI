import express from 'express';
import dotenv from 'dotenv'; // dotenv 모듈 가져오기
import ImageKit from "imagekit"; // ImageKit 모듈 가져오기
import cors from "cors";
import mongoose from "mongoose";

dotenv.config(); // .env 파일의 환경 변수 로드

const port = process.env.PORT || 3000; // 환경 변수 PORT가 설정되어 있지 않으면 3000 사용
const app = express(); // Express 애플리케이션 인스턴스 생성

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        //credentials: true,
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

//
app.post("/api/chats", (req, res) => {
    const {text} = req.body
    console.log(text)
});


// 지정된 포트에서 서버 시작
app.listen(port, () => {
    connect() // 잘 연결되면 "connected to MongoDB" 메세지 나옴.
    console.log(`Server running on ${port}`); // 서버 실행 중 메시지 출력
});
