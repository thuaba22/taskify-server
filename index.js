const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.unqmcva.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // users collection
    const usersCollection = client.db("taskifyDB").collection("users");
    //post method
    app.post("/users", async (req, res) => {
      try {
        const userData = req.body;
        const query = { email: userData.email };
        const existingUser = await usersCollection.findOne(query);
        if (existingUser) {
          return res.send({
            message: "user already exists",
            instertedId: null,
          });
        }

        // Save user information to the users collection
        const result = await usersCollection.insertOne({
          ...userData,
        });

        // Check if the user was inserted successfully
        if (result.insertedCount > 0) {
          res.json({ success: true, message: "User registered successfully." });
        } else {
          res
            .status(500)
            .json({ success: false, message: "Failed to register user." });
        }
      } catch (error) {
        console.error("Error during user registration:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error." });
      }
    });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Taskify is running");
});

app.listen(port, () => {
  console.log(`Taskify server is running on port ${port}`);
});
