// import "./Chat.css";
// import React, {useContext,useState,useEffect} from "react";
// import {MyContext} from "./MyContext.jsx";
// import ReactMarkdown from "react-markdown";
// import rehypeHighLight from "rehype-highlight";
// import "highlight.js/styles/github-dark.css";

// function Chat() {
//     const {newChat,prevChats,reply} = useContext(MyContext);
//     const [latestReply,setLatestReply]=useState(null);

    
//     useEffect(() => {
//         if(reply === null) {
//             setLatestReply(null); //prevchat load
//             return;
//         }

//         if(!prevChats?.length) return;

//         const content = reply.split(" "); //individual words

//         let idx = 0;
//         const interval = setInterval(() => {
//             setLatestReply(content.slice(0, idx+1).join(" "));

//             idx++;
//             if(idx >= content.length) clearInterval(interval);
//         }, 40);

//         return () => clearInterval(interval);

//     }, [prevChats, reply])


//     return (
//         <>
//         {newChat && <h1>Start a New Chat!</h1>}
//         <div className="chats">
//            {
//             prevChats?.slice(0,-1).map((chat,idx) =>
//                  <div className={chat.role ==="user"?"userDiv":"gptDiv"} key={idx}>
//                     {
//                         chat.role === "user"?
//                         <p className="userMessage">{chat.content}</p>:
//                         <ReactMarkdown rehypePlugins={[rehypeHighLight]}>{chat.content}</ReactMarkdown>
//                     }
//                  </div>    
//             )
//            }

//            {
//             prevChats.length > 0 && latestReply !== null && 
//             <div className="gptDiv" key={"typing"}>
//                 <ReactMarkdown rehypePlugins={[rehypeHighLight]}>{latestReply}</ReactMarkdown>
//             </div>
//            }
           
        
//            {
//             (prevChats.length > 0 || latestReply ) && 
//             <div className="gptDiv" key={"non-typing"}>
//             <ReactMarkdown rehypePlugins={[rehypeHighLight]}>
//             {latestReply ?? prevChats[prevChats.length-1].content}
//              </ReactMarkdown>
//             </div>
//             }


//         </div>
//         </>
//     )
// }

// export default Chat;

import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    // Typing animation for assistant
    useEffect(() => {
        if (!reply) {
            setLatestReply(null);
            return;
        }

        const content = reply.split(" ");
        let idx = 0;

        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));
            idx++;
            if (idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);
    }, [reply]); // prevChats removed to avoid duplicate rendering

    return (
        <>
            {newChat && <h1>Start a New Chat!</h1>}
            <div className="chats">
                {prevChats.map((chat, idx) => {
                    // Only show latestReply for the last assistant message
                    const isLastAssistant =
                        chat.role === "assistant" && idx === prevChats.length - 1;

                    return (
                        <div
                            className={chat.role === "user" ? "userDiv" : "gptDiv"}
                            key={idx}
                        >
                            {chat.role === "user" ? (
                                <p className="userMessage">{chat.content}</p>
                            ) : isLastAssistant && latestReply !== null ? (
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                    {latestReply}
                                </ReactMarkdown>
                            ) : (
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                    {chat.content}
                                </ReactMarkdown>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default Chat;
