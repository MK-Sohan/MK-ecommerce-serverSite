const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// mddleware
const cors = require("cors");
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4jcnj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function varifyJwt(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send({ message: "Un authorize access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, "shhhhh", function (err, decoded) {
    req.decoded = decoded;
    console.log(decoded);
    next();
  });
}

// try start from here===============================

async function run() {
  try {
    await client.connect();
    const allProductsCollection = client
      .db("allproducts")
      .collection("products");
    const userCollection = client.db("allproducts").collection("users");
    const cartCollection = client.db("allcartProducts").collection("cart");

    const reviewsCollection = client
      .db("Customers-Reviews")
      .collection("reviews");

    app.get("/mans", async (req, res) => {
      const catagory = req.query.catagory;

      const query = { catagory: catagory };
      const result = await allProductsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/womans", async (req, res) => {
      const catagory = req.query.catagory;
      const query = { catagory: catagory };
      const result = await allProductsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/shoes", async (req, res) => {
      const catagory = req.query.catagory;
      const query = { catagory: catagory };
      const result = await allProductsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/gadget", async (req, res) => {
      const catagory = req.query.catagory;
      const query = { catagory: catagory };
      const result = await allProductsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/products", async (req, res) => {
      const query = {};
      const result = await allProductsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/reviews", async (req, res) => {
      const query = {};
      const result = await reviewsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/productdetail/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await allProductsCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      var token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "40d",
      });
      res.send({ result, token });
    });

    app.get("/user", async (req, res) => {
      const query = {};
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });
    app.post("/carts", async (req, res) => {
      const cart = req.body;
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    });
    app.get("/cart/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

// try end from here===============================

app.get("/", (req, res) => {
  res.send("my personal project is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
