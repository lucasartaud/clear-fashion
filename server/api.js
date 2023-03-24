const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { MongoClient, ObjectId } = require('mongodb');
const MONGODB_URI = 'mongodb+srv://lucas:123@cluster0.ihowrxt.mongodb.net/?retryWrites=true&writeConcern=majority';
const MONGODB_DB_NAME = 'clearfashion';

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);

app.get('/products/search', async (req, res) => {
  const show = parseInt(req.query.show) || 12;
  const page = parseInt(req.query.page) || 1;
  const brand = req.query.brand;
  const price = req.query.price;
  const days = parseInt(req.query.days);
  const sort = req.query.sort;

  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db = client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');

  let filter = {};
  if (brand) {
    filter.brand = brand;
    console.log("yes");
  }
  if (price) {
    filter.price = { $lte: parseInt(price) };
  }
  if (days) {
    const cutoffDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
    filter.releaseDate = { $gte: cutoffDate };
  }

  let sortOptions = {price: 1};
  if (sort === 'cheap') {
    sortOptions.price = 1;
  } else if (sort === 'expensive') {
    sortOptions.price = -1;
  } else if (sort === 'recent') {
    sortOptions._id = -1;
  } else if (sort === 'oldest') {
    sortOptions._id = 1;
  }

  const count = await collection.countDocuments(filter);
  const totalPages = Math.ceil(count / show);
  const skip = (page - 1) * show;

  const result = await collection.find(filter).sort(sortOptions).skip(skip).limit(show).toArray();

  res.json({
    currentPage: page,
    totalPages: totalPages,
    totalCount: count,
    data: result
  });
});

app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;

  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db = client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');

  const result = await collection.find({ _id: ObjectId(productId) }).toArray();

  res.json(result);
});

app.get('/products', async (req, res) => {
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db = client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');

  const result = await collection.find({}).toArray();

  res.json(result);
});

app.get('/brands', async (req, res) => {
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db = client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');

  const result = await collection.distinct('brand');

  res.json(result);
});