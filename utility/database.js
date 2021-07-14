const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let _db;
const mongoConnect = (callback) => {
  const uri =
    "mongodb+srv://phonenumber:z1RE71hgPiZN5yk7@my-cluster.xi1xh.mongodb.net/node-app?retryWrites=true&w=majority";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client
    .connect()
    .then((client2) => {
      _db = client2.db();
      callback();
    })
    .catch();
};
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No Database";
};
module.exports = { mongoConnect, getDb };
