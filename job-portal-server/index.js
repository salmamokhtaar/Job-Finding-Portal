const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const companyRoutes = require('./routes/companyRoutes');
const applicantRoutes = require('./routes/applicantRoutes');

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mern-job-portal-demo.sisdk6h.mongodb.net/?retryWrites=true&w=majority&appName=mern-job-portal-demo`;

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/applicant', applicantRoutes);

// Legacy routes for backward compatibility
// These will be removed in future versions
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const db = client.db("mernJobPortal");
    const jobCollections = db.collection("demoJobs");
    const userCollections = db.collection("userCollection");
    const ApplicantCollection = db.collection("ApplicantCollection");

    // Legacy applicants endpoint
    app.post("/user/Applicant", async (req, res) => {
      const { email } = req.body;
      if (!email) {
        return res.status(400).send({
          message: "Email is required.",
          status: false
        });
      }
      const existingEmail = await ApplicantCollection.findOne({ email });
      if (existingEmail) {
        return res.status(400).send({
          message: "Email already exists.",
          status: false
        });
      }
      const newApplicant = {
        email,
        createdAt: new Date()
      };
      const result = await ApplicantCollection.insertOne(newApplicant);
      if (result.insertedId) {
        return res.status(200).send({
          message: "Email sent successfully.",
          status: true
        });
      } else {
        return res.status(500).send({
          message: "Cannot insert email. Please try again.",
          status: false
        });
      }
    });

    // Legacy get applicants
    app.get("/get/applicants", async (req, res) => {
      const applicant = await ApplicantCollection.find({}).toArray();
      res.send(applicant);
    });

    // Legacy register
    app.post("/user/register", async (req, res) => {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).send({
          message: "Username, email, and password are required.",
          status: false
        });
      }
      const existingUser = await userCollections.findOne({ email });
      if (existingUser) {
        return res.status(400).send({
          message: "User already exists.",
          status: false
        });
      }
      const newUser = {
        username,
        email,
        password,
        createdAt: new Date()
      };
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

    // Legacy get users
    app.get("/get-user", async (req, res) => {
      const users = await userCollections.find({}).toArray();
      res.send(users);
    });

    // Legacy get single user
    app.get("/single/user/:id", async (req, res) => {
      const id = req.params.id;
      const user = await userCollections.findOne({
        _id: new ObjectId(id)
      });
      res.send(user);
    });

    // Legacy delete user
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await userCollections.deleteOne(filter);
      res.send(result);
    });

    // Legacy update user
    app.put("/user/update/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const update = { $set: req.body };
      const options = { returnOriginal: false };
      try {
        const result = await userCollections.findOneAndUpdate(filter, update, options);
        if (result.value) {
          res.status(200).send({
            message: "User updated successfully.",
            status: true
          });
        } else {
          res.status(400).send({
            message: "User not found.",
            status: false
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "Cannot update user. Please try again.",
          status: false
        });
      }
    });

    // Legacy login
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
        console.log(error);
      }
    });

    // Legacy post job
    app.post("/post-job", async (req, res) => {
      const body = req.body;
      body.createAt = new Date();
      const result = await jobCollections.insertOne(body);
      if (result.insertedId) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send({
          message: "Cannot insert job try Again",
          status: false
        });
      }
    });

    // Legacy get all jobs
    app.get("/all-jobs", async (req, res) => {
      const jobs = await jobCollections.find({}).toArray();
      res.send(jobs);
    });

    // Legacy get jobs by email
    app.get("/myJobs/:email", async (req, res) => {
      const jobs = await jobCollections.find({ postedBy: req.params.email }).toArray();
      res.send(jobs);
    });

    // Legacy get single job by id
    app.get("/all-jobs/:id", async (req, res) => {
      const id = req.params.id;
      const job = await jobCollections.findOne({
        _id: new ObjectId(id)
      });
      res.send(job);
    });

    // Legacy delete job
    app.delete("/job/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await jobCollections.deleteOne(filter);
      res.send(result);
    });

    // Legacy update job
    app.patch("/update-job/:id", async (req, res) => {
      const id = req.params.id;
      const jobData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...jobData
        },
      };
      const result = await jobCollections.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your Database. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB error:", error);
  }
}

run().catch(console.dir);

// Root route
app.get('/', (req, res) => {
  res.send('Job Portal API is running!');
});

// Start server
app.listen(port, () => {
  console.log(`Job Portal server is running on port ${port}`);
});
