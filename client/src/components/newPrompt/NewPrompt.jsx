import './newPrompt.css'
import {useEffect, useRef, useState} from "react";
import Upload from "../upload/Upload.jsx";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini.js";
import Markdown from "react-markdown";

const NewPrompt = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    // upload img
    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
    });

    const chat = model.startChat({
        history: [
            {
                role:"user",
                parts: [{text: "Hello, I have 2 dogs"}],
            },
            {
                role:"model",
                parts: [{text:"Great to meet you."}],
            },
        ],
        generationConfig: {
            //maxOutputTokens: 100,
        },
    });


    // 자동으로 스크롤 내려가서 마지막 글 보이게 하기
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" });
    }, [ question, answer, img.dbData]);


    const add = async (text) => {
        setQuestion(text);

        const result = await chat.sendMessageStream(Object.entries(img.aiData).length ? [img.aiData, text] : [text]
        );
        let accumulatedText = "";
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            console.log(chunkText);
            accumulatedText += chunkText;
            setAnswer(accumulatedText);
        }
        setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const text = e.target.text.value;
        if (!text) return;

        add(text);
    };

    return (
        <>
            {/* Add new chat */}
            {/* loading img */}
            {img.isLoading && <div className="">Loading...</div>}
            {/* upload img */}
            {img.dbData?.filePath && (
                <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    path={img.dbData?.filePath}
                    width="180"
                    transformation={[{width: 180}]}
                />
            )}
            {/* Question and Answer */}
            {question && <div className="message user">{question}</div>}
            {answer && (
                <div className="message">
                    <Markdown>{answer}</Markdown>
                </div>
            )}
            <div className="endChat" ref={endRef}></div>
            <form className="newForm" onSubmit={handleSubmit} >
                <Upload setImg={setImg}/>
                <input id="file" type="file" multiple={false} hidden/>
                <input type="text" name="text" placeholder="Ask anything..."/>
                <button>
                    <img src="/arrow.png" alt=""/>
                </button>
            </form>
        </>
    );
};

export default NewPrompt;