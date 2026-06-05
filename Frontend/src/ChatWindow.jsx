// import "./ChatWindow.css";
// import Chat from "./Chat.jsx";
// import {MyContext} from "./MyContext.jsx";
// import {useContext , useState ,useEffect} from "react";
// import {ScaleLoader} from "react-spinners";


// function ChatWindow() {
//     const {prompt , setPrompt ,reply , setReply,currThreadId , prevChats , setPrevChats , setNewChat} = useContext(MyContext);
//     const [loading ,setLoading] = useState(false);
//     const [isOpen , setIsOpen] = useState(false);

//     const getReply = async () => {
        
//         // console.log("message",prompt,"threadId",currThreadId);
//         setLoading (true);
//         setNewChat(false);
//         const options = {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 message: prompt,
//                 threadId: currThreadId,
//             })
//         };

//         try {
//               const responce = await fetch("http://localhost:8080/api/chat", options);
//               const res = await responce.json();
//               console.log(res);
//               setReply(res.reply);
//         }catch(err) {
//            console.log(err);
//         }
//         setLoading (false);
//     }

//     //Append new chat to prevChats
//     useEffect(() => {
//         if(prompt && reply) {
//             setPrevChats(prevChats => (
//                 [...prevChats, {
//                     role: "user",
//                     content: prompt
//                 },
//                 {
//                     role: "assistant",
//                     content: reply
//                 }]
//             ))
//         }
//         setPrompt("");
//     }, [reply]);

//     const handleProfileClick = () => {
//         setIsOpen(!isOpen);
//     }

//     return (
//         <div className="chatWindow">
//            <div className="navbar">
//               <span>ChatGPT<i className="fa-solid fa-chevron-down"></i></span>
//               <div className="userIconDiv" onClick={handleProfileClick}>
//                   <span className="userIcon"><i className="fa-solid fa-user"></i></span>
//               </div>
//            </div> 
//            {
//                isOpen && 
//                <div className="dropDown">
//                   <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i>Upgrade plan</div>
//                   <div className="dropDownItem"><i className="fa-solid fa-gear"></i>Setting</div>
//                   <div className="dropDownItem"><i className="fa-solid fa-arrow-right-from-bracket"></i>Log Out</div>
//                </div>
//            }
//            <Chat></Chat>

//            <ScaleLoader color='#fff' loading={loading}>

//            </ScaleLoader>

//            <div className="chatInput">
//               <div className="inputBox">
               
//                  <input placeholder="Ask anything..."
//                     value={prompt}
//                     onChange={(e) => setPrompt(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter'?getReply() : ' '}
//                 >

            
//                 </input>
//                  <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
//                </div> 
//                <p className="info">
//                 ChatGPT can make mistakes. Check important info. See Cookie Preferences. 
//                </p>
//            </div>
//         </div>
//     )
// }

// export default ChatWindow;


import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

// const API = "http://localhost:8080/api";

// const API = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api`;

const API = `${import.meta.env.VITE_API_URL}/api`;

const authFetch = async (url, options = {}, navigate) => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/");
        throw new Error("No token");
    }
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });
    if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        throw new Error("Session expired");
    }
    return res;
};

function ChatWindow() {
    const {
        prompt, setPrompt,
        reply, setReply,
        currThreadId,
        prevChats, setPrevChats,
        setNewChat
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [firstName, setFirstName] = useState("U");
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // ✅ User ka naam database se lo
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await authFetch(`${API}/auth/me`, {}, navigate);
                const data = await res.json();
                const first = data?.username?.trim().split(" ")[0] || "User";
                setFirstName(first);
            } catch (err) {
                console.error("getUser error:", err.message);
            }
        };
        getUser();
    }, []);

    // ✅ Dropdown bahar click karne pe band ho
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ✅ Chat API call with token
    const getReply = async () => {
        if (!prompt.trim() || loading) return;
        setLoading(true);
        setNewChat(false);

        try {
            const res = await authFetch(`${API}/chat`, {
                method: "POST",
                body: JSON.stringify({
                    message: prompt,
                    threadId: currThreadId,
                }),
            }, navigate);

            const data = await res.json();
            setReply(data.reply);
        } catch (err) {
            console.error("getReply error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Append new messages to prevChats
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prev => [
                ...prev,
                { role: "user", content: prompt },
                { role: "assistant", content: reply },
            ]);
        }
        setPrompt("");
    }, [reply]);

    // ✅ Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            getReply();
        }
    };

    return (
        <div className="chatWindow">
            {/* Navbar */}
            <div className="navbar">
                <span>SigmaGPT</span>

                <div className="userIconDiv" onClick={() => setIsOpen(!isOpen)} ref={dropdownRef}>
                    <span className="userIcon">
                        {firstName.charAt(0).toUpperCase()}
                    </span>

                    {/* Dropdown */}
                    {isOpen && (
                        <div className="dropDown">
                            <div className="dropDownItem logout" onClick={handleLogout}>
                                <i className="fa-solid fa-arrow-right-from-bracket"></i> Log Out
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Messages */}
            <Chat />

            {/* Loading Spinner */}
            <ScaleLoader color="#fff" loading={loading} />

            {/* Input Area */}
            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask anything..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />
                    <div
                        id="submit"
                        onClick={getReply}
                        style={{ opacity: loading ? 0.5 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info.
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;