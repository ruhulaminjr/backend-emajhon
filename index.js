const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// database config setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bdjvz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const productsDb = client.db("productsDb");
    const productsCollection = productsDb.collection("products");

    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const count = await cursor.count();
      const page = req.query.page;
      const size = parseInt(req.query.size);
      let findProducts;
      if (page) {
        findProducts = await cursor
          .skip(page * size)
          .limit(10)
          .toArray();
      } else {
        findProducts = await cursor.toArray();
        console.log("all products send");
      }
      res.send({ count, findProducts });
    });
    app.post("/cartproducts", async (req, res) => {
      let cardKeys = req.body;
      const query = { key: { $in: cardKeys } };
      const cardProducts = await productsCollection.find(query).toArray();
      console.log(cardProducts);
      res.json(cardProducts);
    });
  } finally {
  }
}
app.get("/", (req, res) => {
  res.send('<h2 style="text-align:center">Server Running Successfully</h2>');
});
app.get("/ruhul", (req, res) => {
  res.send('<h1 style="text-align:center"> Hello Ruhul AMin Jr </h1>');
});
run().catch(console.error);

app.listen(port, () => {
  console.log(`server is Running On http://localhost:${port}`);
});
