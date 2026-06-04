// import "dotenv/config";

// const getOpenAIAPIResponce = async (message) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: [{
//                 role: "user",
//                 content: message
//             }]
//         })
//     };
//     try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await response.json();
//         return data.choices[0].message.content;
//     } catch (err) {
//         console.error("Error fetching OpenAI API response:", err);
//         throw err;
//     }
// }

// export default getOpenAIAPIResponce;


import "dotenv/config";

const getOpenAIAPIResponce = async (message) => {

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            // model: "llama3-8b-8192", // ✅ Groq supported model
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "user",
                    content: message
                }
            ]
        })
    };

    try {
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            options
        );

        const data = await response.json();

        console.log("AI RESPONSE:", data);

        if (!data.choices) {
            throw new Error(data.error?.message || "API error");
        }

        return data.choices[0].message.content;

    } catch (err) {
        console.error("Error fetching AI response:", err.message);
        throw err;
    }
};

export default getOpenAIAPIResponce;