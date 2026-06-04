// // Note: The below code is the simplified version without authentication.
// import { useState } from 'react'
// import Sidebar from './Sidebar.jsx'
// import ChatWindow from './ChatWindow.jsx'
// import {MyContext} from "./MyContext.jsx";
// import './App.css'
// import { v1 as uuidv1 } from 'uuid';

// function App() {
//   const [prompt, setPrompt] = useState("");
//   const [reply, setReply] = useState(null);
//   const [currThreadId , setCurrThreadId] = useState(uuidv1());
//   const [prevChats, setPrevChats] = useState ([]);
//   const [newChat, setNewChat] = useState (true);
//   const [allThreads , setAllThreads] = useState ([]);

//   const providerValue = {
//     prompt, setPrompt,
//     reply , setReply,
//     currThreadId , setCurrThreadId,
//     newChat , setNewChat,
//     prevChats , setPrevChats,
//     allThreads , setAllThreads
//   };

//   return (
//     <div className="app">
//        <MyContext.Provider value={providerValue}>
//        <Sidebar></Sidebar>
//        <ChatWindow></ChatWindow>
//         </MyContext.Provider>
//     </div>
//   )
// }

// export default App

// // Note: The below code is the version with authentication and protected routes. You can switch between the two versions by commenting/uncommenting the respective code blocks.
// // import { useState } from 'react'
// // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // import Sidebar from './Sidebar.jsx'
// // import ChatWindow from './ChatWindow.jsx'
// // import AuthPage from './AuthPage.jsx' // Login/Signup Page
// // import { MyContext } from "./MyContext.jsx";
// // import './App.css'
// // import { v1 as uuidv1 } from 'uuid';


// // // 1. Gatekeeper: Ye check karega ki user logged in hai ya nahi
// // const ProtectedRoute = ({ children }) => {
// //   const token = localStorage.getItem('token');
// //   if (!token) {
// //     // Agar token nahi hai, toh Login page pe bhejo aur Alert ka state pass karo
// //     return <Navigate to="/" state={{ alert: "Access Denied! Please login first." }} replace />;
// //   }
// //   return children;
// // };

// // function App() {
// //   const [prompt, setPrompt] = useState("");
// //   const [reply, setReply] = useState(null);
// //   const [currThreadId, setCurrThreadId] = useState(uuidv1());
// //   const [prevChats, setPrevChats] = useState([]);
// //   const [newChat, setNewChat] = useState(true);
// //   const [allThreads, setAllThreads] = useState([]);

// //   const providerValue = {
// //     prompt, setPrompt,
// //     reply, setReply,
// //     currThreadId, setCurrThreadId,
// //     newChat, setNewChat,
// //     prevChats, setPrevChats,
// //     allThreads, setAllThreads
// //   };

// //   return (
// //     <Router>
// //       <Routes>
// //         {/* Route 1: Login/Signup Page (Starting Page) */}
// //         <Route path="/" element={<AuthPage />} />

// //         {/* Route 2: Dashboard/Chat (Sirf Login ke baad dikhega) */}
// //         <Route 
// //           path="/dashboard" 
// //           element={
// //             <ProtectedRoute>
// //               <div className="app">
// //                 <MyContext.Provider value={providerValue}>
// //                   <Sidebar />
// //                   <ChatWindow />
// //                 </MyContext.Provider>
// //               </div>
// //             </ProtectedRoute>
// //           } 
// //         />

// //         {/* Route 3: Agar koi galat URL daale toh wapas Login pe bhej do */}
// //         <Route path="*" element={<Navigate to="/" />} />
// //       </Routes>
// //     </Router>
// //   );
// // }

// // export default App;


import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx'
import ChatWindow from './ChatWindow.jsx'
import AuthPage from './AuthPage.jsx'
import { MyContext } from "./MyContext.jsx";
import './App.css'
import { v1 as uuidv1 } from 'uuid';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" state={{ alert: "Access Denied! Please login first." }} replace />;
  }
  return children;
};

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValue = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <div className="app">
                <MyContext.Provider value={providerValue}>
                  <Sidebar />
                  <ChatWindow />
                </MyContext.Provider>
              </div>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;