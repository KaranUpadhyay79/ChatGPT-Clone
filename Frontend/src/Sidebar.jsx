
// import "./sidebar.css";
// import {useContext,useEffect} from "react";
// import {MyContext} from "./MyContext.jsx";
// import { v1 as uuidv1 } from 'uuid';

// function Sidebar() {
//     const {allThreads, setAllThreads, currThreadId,setNewChat,setPrompt , setReply , setCurrThreadId,setPrevChats} = useContext(MyContext);

//     const getAllThreads = async () => {
//         try{
//             const response = await fetch("http://localhost:8080/api/thread");
//             const res = await response.json();
//             const filteredData = res.map(thread => ({
//                 threadId: thread.threadId,
//                 title: thread.title,
//             }));
//             //console.log(filteredData);
//             setAllThreads(filteredData);
//         }catch(err){
//             console.log(err);
//         }
//     };

//     useEffect(() => {
//         getAllThreads();
//     }, [currThreadId]);

//     const createNewChat = () => {
//         setNewChat(true);
//         setPrompt("");
//         setReply(null);
//         setCurrThreadId (uuidv1());
//         setPrevChats([]);
//     };

//     const changeThread = async (newThreadId) => {
//         setCurrThreadId(newThreadId);

//         try {
//             const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
//             const res = await response.json();
//             //console.log(res);
//             // setPrevChats(res);
            
//              setPrevChats(Array.isArray(res.messages) ? res.messages : []);

//             setNewChat(false);
//             setReply(null);
//         } catch(err) {
//             console.log(err);
//         }
//     }   

//     const deleteThread = async (threadId) => {
//     try {
//         const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
//             method: "DELETE",
//         });

//         if(!response.ok) throw new Error("Failed to delete thread");

//         const data = await response.json();
//         //console.log("Deleted:", data);

//         // UI update
//         setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

//         // Agar current thread delete hua → new chat
//         if(threadId === currThreadId) {
//             createNewChat();
//         }

//     } catch(err) {
//         console.error(err);
//     }
// };



//     return (
//         <section className="sidebar">
//             {/* New chat button */}
//             <button onClick={createNewChat}>
//                 <img src="src/assets/blacklogo.png" alt="gpt logo"className="logo"/>
//           <span><i className="fa-solid fa-pen-to-square"></i></span>

//             </button>
//             {/* History */}
//             <ul className="history">
//                 {
//                     allThreads?.map((thread,idx) => (
//                         <li key={idx}
//                            onClick={() => changeThread(thread.threadId)}
//                            className={thread.threadId === currThreadId ? "highlighted": " "}
//                         >
//                             {thread.title}
//                             <i className="fa-solid fa-trash"
//                              onClick={(e) => {
//                                 e.stopPropagation();
//                                 deleteThread(thread.threadId);
//                              }}
//                              ></i>
//                         </li>
//                     ))
//                 }
//             </ul>
//             {/* sign */}
//             <div className="sign">
//                 <p>By Karan &hearts;</p>
//             </div>
//         </section>
//     )
// }
// export default Sidebar;


import "./Sidebar.css"
import { useContext, useEffect, useState, useCallback } from "react";
import { MyContext } from "./MyContext.jsx";
import { useNavigate } from "react-router-dom";
import { v1 as uuidv1 } from 'uuid';

const API = "http://localhost:8080/api";

// ✅ Central fetch helper — token attach karta hai, 401 pe logout
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

function Sidebar() {
    const {
        allThreads, setAllThreads,
        currThreadId, setNewChat,
        setPrompt, setReply,
        setCurrThreadId, setPrevChats
    } = useContext(MyContext);

    const [firstName, setFirstName] = useState("User");
    const navigate = useNavigate();

    // ✅ Database se user ka pehla naam lo
    const getUser = useCallback(async () => {
        try {
            const res = await authFetch(`${API}/auth/me`, {}, navigate);
            const data = await res.json();
            const first = data?.username?.trim().split(" ")[0] || "User";
            setFirstName(first);
        } catch (err) {
            console.error("getUser error:", err.message);
        }
    }, [navigate]);

    // ✅ Sirf logged-in user ke threads lo
    const getAllThreads = useCallback(async () => {
        try {
            const res = await authFetch(`${API}/thread`, {}, navigate);
            const data = await res.json();
            const filtered = data.map(thread => ({
                threadId: thread.threadId,
                title: thread.title,
            }));
            setAllThreads(filtered);
        } catch (err) {
            console.error("getAllThreads error:", err.message);
        }
    }, [navigate, setAllThreads]);

    useEffect(() => { getUser(); }, [getUser]);
    useEffect(() => { getAllThreads(); }, [currThreadId, getAllThreads]);

    const createNewChat = useCallback(() => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }, [setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats]);

    const changeThread = useCallback(async (newThreadId) => {
        setCurrThreadId(newThreadId);
        try {
            const res = await authFetch(`${API}/thread/${newThreadId}`, {}, navigate);
            const data = await res.json();
            setPrevChats(Array.isArray(data.messages) ? data.messages : []);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.error("changeThread error:", err.message);
        }
    }, [navigate, setCurrThreadId, setPrevChats, setNewChat, setReply]);

    const deleteThread = useCallback(async (threadId) => {
        try {
            const res = await authFetch(`${API}/thread/${threadId}`, { method: "DELETE" }, navigate);
            if (!res.ok) throw new Error("Failed to delete thread");
            setAllThreads(prev => prev.filter(t => t.threadId !== threadId));
            if (threadId === currThreadId) createNewChat();
        } catch (err) {
            console.error("deleteThread error:", err.message);
        }
    }, [navigate, currThreadId, setAllThreads, createNewChat]);

    // ✅ Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <section className="sidebar">
            {/* New chat button */}
            <button onClick={createNewChat}>
                {/* <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo" /> */}
                <img src="/blacklogo.png" alt="gpt logo" className="logo" />
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            {/* Thread History */}
            <ul className="history">
                {allThreads?.map((thread, idx) => (
                    <li
                        key={idx}
                        onClick={() => changeThread(thread.threadId)}
                        className={thread.threadId === currThreadId ? "highlighted" : ""}
                    >
                        <span className="thread-title">{thread.title}</span>
                        <i
                            className="fa-solid fa-trash"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}
                        ></i>
                    </li>
                ))}
            </ul>

            {/* Bottom: Name + Logout */}
            <div className="sign">
                <p>By {firstName} &hearts;</p>
            </div>
        </section>
    );
}

export default Sidebar;