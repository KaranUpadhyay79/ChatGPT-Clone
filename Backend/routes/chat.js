import express from "express";
import Thread from "../models/Threads.js";
import getOpenAIResponse from "../utils/openai.js";

const router = express.Router();

//test
router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "Testing Another Title"
    });
       const responce = await thread.save();
       res.send(responce);
    } catch (err) {
        console.log(err);
        res.status(500).send({error:"Server Error"});
    }
});

//Get all threads
router.get("/thread" , async (req, res) => {
    try{
        //descending order of updateAt...most recent data on top 
        const threads = await Thread.find({}).sort({updatedAt:-1});
        res.send(threads);
    }catch(err){
        console.log(err);
        res.status(500).send({error:"Failed to fetch threads"});
    }
});

router.get("/thread/:threadId",async (req,res)=> {
    const {threadId} = req.params;
    try{
      const thread = await Thread.findOne({threadId});
      if(!thread){
        return res.status(404).send({error:"Thread not found"});
      }
      res.send(thread);
    }catch(err){
        console.log(err);
        res.status(500).send({error:"Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId", async (req,res) => {
    const {threadId} = req.params;
    try{
       const deletedThread = await Thread.findOneAndDelete({threadId});
         if(!deletedThread){
            return res.status(404).send({error:"Thread not found"});
         }

          res.json({message: "Thread deleted successfully", threadId});
          
    }catch(err){
        console.log(err);
        res.status(500).send({error:"Failed to delete thread"});
    }
});
 
router.post("/chat", async (req, res) => {
    const {threadId , message} = req.body;

    if(!threadId || !message){
        return res.status(400).send({error:"missing required fields"});
    }
    try{
        let thread = await Thread.findOne({threadId});
        if(!thread){
            //create new thread in DB 
            thread = new Thread ({
                threadId ,
                title:message,
                messages:[{role:"user",content:message}]
            });
        }else {
            thread.messages.push({role:"user",content:message})
        }

        const assistantReply = await getOpenAIResponse(message);

        thread.messages.push({role:"assistant",content:assistantReply});
        thread.updatedAt = new Date();
        await thread.save();

        res.json({reply:assistantReply});

    }catch(err){
        console.log(err);   
        res.status(500).send({error:"something went wrong"});
    }
});
export default router;