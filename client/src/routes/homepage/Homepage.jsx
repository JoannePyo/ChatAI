import "./homepage.css"
import {Link} from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

const Homepage = () => {
    // useState 훅을 사용하여 typingStatus 라는 상태 변수를 생성하고 초기값을 "human1"로 설정
    const [typingStatus, setTypingStatus] = useState("human1");


    return (

        <div className="homepage">
            <img src="/orbital.png" alt="" className="orbital"/>
            <div className="left">
                <h1>CHAT AI</h1>
                <h2>Start your journey with your AI friend, ChatAI!</h2>
                <h3>
                    ChatAI is your instant source for answers to your questions and engaging conversations on a wide
                    range of topics. It provides creative ideas and information, helping you resolve your curiosities.
                </h3>
                <Link to="/dashboard">Get Started</Link>
            </div>
            <div className="right">
                {/* Robot Image */}
                <div className="imgContainer">
                    <div className="bgContainer">
                        <div className="bg"></div>
                    </div>
                    <img src="/bot.png" alt="" className="bot" />
                    {/* Chat */}
                    <div className="chat">
                        {/* Chat Image */}
                        <img
                            src={
                                typingStatus === "human1" // typingStatus 가 "human1"일 경우 human1의 이미지를 사용
                                    ? "/human1.jpeg" // "human1" 이미지 경로
                                    : typingStatus === "human2" // typingStatus 가 "human2"일 경우
                                        ? "/human2.jpeg" // "human2" 이미지 경로
                                        : "bot.png" // 그 외의 경우, 기본 봇 이미지를 사용
                            }
                            alt="" // 이미지에 대한 대체 텍스트 (비어 있음)
                        />
                        {/* Text animation */}
                        <TypeAnimation
                            sequence={[
                                "Human: I want to make pasta.",
                                2000, // wait 2 mins
                                () => {
                                    setTypingStatus("bot"); // Set the next speaker to "bot"
                                },
                                "Bot: What kind of pasta do you want to make?",
                                2000,
                                () => {
                                    setTypingStatus("human2");
                                },
                                "Human2: I want to eat cream sauce pasta!",
                                2000,
                                () => {
                                    setTypingStatus("bot");
                                },
                                "Bot: Then you'll prepare fresh cream and mushrooms.",
                                2000,
                                () => {
                                    setTypingStatus("human1");
                                },
                            ]}
                            wrapper="span" // Use span to wrap each text
                            repeat={Infinity} // Repeat the animation indefinitely
                            cursor={true} // Show the cursor
                            omitDeletionAnimation={true} // Omit the deletion animation
                        />
                    </div>
                </div>
            </div>
            <div className="terms">
                <img src="/logo.png" alt=""/>
                <div className="links">
                    <Link to="/">Terms of Service</Link>
                    <span>|</span>
                    <Link to="/">Privacy Policy</Link>
                </div>
            </div>
        </div>
    );
};

export default Homepage;