const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_user);
// console.log(process.env.DB_pass);

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.tkglq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    //     collection
    const cofeeCollection = client.db("cofeeDB").collection("cofee");
    //  all cofees(get )
    app.get("/cofee", async (req, res) => {
      const cursor = cofeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // find cofee
    app.get("/cofee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cofeeCollection.findOne(query);
      res.send(result);
    });

    // create cofee
    app.post("/cofee", async (req, res) => {
      const newCofee = req.body;
      console.log(newCofee);
      const result = await cofeeCollection.insertOne(newCofee);
      res.send(result);
    });
    // put
    app.put("/cofee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCofee = req.body;
      const cofee = {
        $set: {
          price: updatedCofee.price,
          photo: updatedCofee.photo,
          details: updatedCofee.details,
          category: updatedCofee.category,
          taste: updatedCofee.taste,
          supplier: updatedCofee.supplier,
          name: updatedCofee.name,
          chef: updatedCofee.chef,
        },
      };
      const result = await cofeeCollection.updateOne(filter, cofee, options);
      res.send(result);
    });
    // delete
    app.delete("/cofee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }; // we try to figure out the path by which we want to find then objectId from mongodb with the new keyword then we send the id which we create
      const result = await cofeeCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //     await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("your cofee in processing ");
});

app.listen(port, () => {
  console.log(`cofee server is running on port ${port}`);
});
