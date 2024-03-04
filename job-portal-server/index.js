const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config()


const mongoose = require('mongoose');

// middle ware
app.use(express.json())
app.use(cors()) 
// salmamuqtaarsiman
// GBl3hMtRj0hTFcTZ
// GBl3hMtRj0hTFcTZ

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mern-job-portal-demo.sisdk6h.mongodb.net/?retryWrites=true&w=majority&appName=mern-job-portal-demo`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // create db
    const db= client.db("mernJobPortal")
    // create collection
    const jobCollections = db.collection("demoJobs")
    const userCollections = db.collection("userCollection");

// post re
app.post("/user/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send({
      message: "Username, email, and password are required.",
      status: false
    });
  }

  // Check if the user already exists
  const existingUser = await userCollections.findOne({ email });
  if (existingUser) {
    return res.status(400).send({
      message: "User already exists.",
      status: false
    });
  }

  // Create a new user object
  const newUser = {
    username,
    email,
    password,
    createdAt: new Date()
  };

  // Insert the new user into the collection
  const result = await userCollections.insertOne(newUser);

  if (result.insertedId) {
    return res.status(200).send({
      message: "User registered successfully.",
      status: true
    });
  } else {
    return res.status(500).send({
      message: "Cannot insert user. Please try again.",
      status: false
    });
  }
});
// get
app.get("/get-user" , async (req, res) => {
  const users= await userCollections.find({}).toArray()
  res.send(users)
})
// login
app.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({
      message: "Email and password are required.",
      status: false
    });
  }
  const existingUser = await userCollections.findOne({ email, password });
  if (!existingUser) {
    return res.status(400).send({
      message: "Email or password is incorrect.",
      status: false
    });
  }
  return res.status(200).send({
    message: "Login successful.",
    status: true
  });
  } catch (error) {
    console.log(error)
    
  }
  
});

    // post a job
    app.post("/post-job" , async (req, res) => {
      const body = req.body;
      body.createAt =new Date();
      // console.log(body)
      const result = await jobCollections.insertOne(body);
      // validate
      if(result.insertedId){
        return res.status(200).send(result)
      }else{
        return res.status(404).send({
          message: "Cannot insert job try Again",
          status: false
        })
      }


    })

    // get user
   

    // get all jobs
    app.get("/all-jobs", async(req,res) => {
      const jobs = await jobCollections.find({}).toArray()
      res.send(jobs);

    })

    // get jobs my email
    app.get("/myJobs/:email" , async(req,res) => {
      // console.log(req.params.email)
    const jobs = await jobCollections.find({postedBy : req.params.email}).toArray();
    res.send(jobs);
    
    })
    // get single job by id
    app.get("/all-jobs/:id", async(req,res) => {
      const id = req.params.id;
      const job = await jobCollections.findOne({
        _id: new ObjectId(id)
      })
      res.send(job);
    })
    // delete
    app.delete("/job/:id", async(req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await jobCollections.deleteOne(filter)
      res.send(result)
    });
    // get single job using id
    app.get("/all-jobs/:id", async(req,res) => {
      const id = req.params.id;
      const jobs = await jobCollections.findOne({
        _id : new ObjectId(id)
      })
      res.send(jobs)
    })
    // SIngle update on my jobs
    app.patch("/update-job/:id", async(req,res) => {
      const id = req.params.id;
      const jobData = req.body
      const filter = {_id: new ObjectId(id)}
      const options = {upsert : true}
      const updateDoc = {
        $set : {
          ...jobData
        },
      }
      const result = await jobCollections.updateOne(filter,updateDoc,options)
      res.send(result)
      
    })

  
  


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your Database. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello hhhh!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})