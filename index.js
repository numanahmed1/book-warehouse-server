const express = require("express");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const app = express();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lpxka.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("This is the backend of book warehouse app");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const booksCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("products");
  const ordersCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("orders");

  app.post("/addBook", (req, res) => {
    const newBook = req.body;
    booksCollection.insertOne(newBook).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/products", (req, res) => {
    booksCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.delete("/deleteBook/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    booksCollection.findOneAndDelete({ _id: id }).then((result) => {
      console.log(result);
    });
  });

  app.get("/selectedProduct", (req, res) => {
    const queryId = ObjectId(req.query.id);
    booksCollection.find({ _id: queryId }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/proceedToCheckOut", (req, res) => {
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/orders", (req, res) => {
    const queryEmail = req.query.email;
    console.log(queryEmail);
    ordersCollection.find({ email: queryEmail }).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.listen(port);
