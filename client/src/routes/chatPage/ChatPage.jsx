import "./chatPage.css";
import NewPrompt from "../../components/newPrompt/NewPrompt.jsx";


const ChatPage = () => {

    return (
        <div className="chatPage">
            <div className="wrapper">
                <div className="chat">
                    <div className="message">Test message from ai</div>
                    <div className="message user">Test messageTest messageTest messageTest messageTest messageTest
                        messageTest message
                    </div>
                    <div className="message">Test message from ai</div>
                    <div className="message user">Test message</div>
                    <div className="message">Test message from ai</div>
                    <div className="message user">Test messageTest messageTest messageTest messageTest messageTest
                        messageTest message
                    </div>
                    <div className="message">Test message from ai</div>
                    <div className="message user">Test message</div>
                    <div className="message">Test message from ai</div>
                    <div className="message user">Test messageTest messageTest messageTest messageTest messageTest
                        messageTest message
                    </div>
                    <div className="message">Test message from ai</div>
                    <div className="message user">Test message</div>
                    <div className="message">Test message from ai</div>
                    <div className="message user">Test messageTest messageTest messageTest messageTest messageTest
                        messageTest message
                    </div>
                    <div className="message">Test message from ai</div>
                    <div className="message user">Test message</div>
                    <NewPrompt/>

                </div>
            </div>
        </div>
    );
};

export default ChatPage;