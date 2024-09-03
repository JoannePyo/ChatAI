import './newPrompt.css'
import {useEffect, useRef, useState} from "react";
import Upload from "../upload/Upload.jsx";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini.js";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({data}) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    // upload img
    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
    });

    // 채팅 생성
    const chatHistory = data?.history || [];
    const chat = chatHistory.length > 0 && chatHistory[0]?.role === 'user' ? model.startChat({
        history: chatHistory.map(({ role, parts }) => ({
            role,
            parts: [{ text: parts[0]?.text || '' }],
        })),
        generationConfig: {
            // maxOutputTokens: 100,
        },
    }) : null;


    // 자동으로 스크롤 내려가서 마지막 글 보이게 하기
    const endRef = useRef(null);

    const formRef = useRef(null);

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" });
    }, [ data, question, answer, img.dbData]);

    // Query
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => {
            return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: question.length ? question : undefined,
                    answer,
                    img: img.dbData?.filePath || undefined,
                }),
            }).then((res) => res.json());
        },
        onSuccess: () => {
            queryClient
                .invalidateQueries({ queryKey: ["chat", data._id] })
                .then(() => {
                    formRef.current.reset();
                    setQuestion("");
                    setAnswer("");
                    setImg({
                        isLoading: false,
                        error: "",
                        dbData: {},
                        aiData: {},
                    });
                });
        },
        onError: (err) => {
            console.log(err);
        },
    });

    const add = async (text, isInitial) => {
        if (!isInitial) setQuestion(text);

        // Get result from AI
        try {
            const result = await chat.sendMessageStream(
                Object.entries(img.aiData).length ? [img.aiData, text] : [text]
            );
            let accumulatedText = "";
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                console.log(chunkText);
                accumulatedText += chunkText;
                setAnswer(accumulatedText);
            }

            mutation.mutate();
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const text = e.target.text.value;
        if (!text) return;

        add(text, false);
    };

    // IN PRODUCTION WE DON'T NEED IT
    const hasRun = useRef(false);

    useEffect(() => {
        if (!hasRun.current) {
            if (data?.history?.length === 1) {
                add(data.history[0].parts[0].text, true);
            }
        }
        hasRun.current = true;
    }, []);

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
            <form className="newForm" onSubmit={handleSubmit} ref={formRef} >
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