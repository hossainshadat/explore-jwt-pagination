const { MongoClient, ServerApiVersion } = require("mongodb");
const auth = require("./middleware/auth");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
app.use(cors());
app.use(express.json());

// app.use("*", (req, res, next) => {
//   console.log("Middleware explore" + req.url + " " + req.method);
//   next();
//   res.json({
//     message: " Helloworld",
//   });
// });

const uri = process.env.DB_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    const db = client.db("test");

    const usersCollection = db.collection("users");
    // ROUTES
    app.get("/users", auth, async (req, res) => {
      const users = await db.collection("users").find().toArray();
      res.send({
        message: " success",
        data: users,
      });
    });

    app.get("/pagination", async (req, res) => {
      /**
       * take a query params from the user -> limit, page
       *
       * run query
       *
       */

      // [1, 2, 3, 4, 5, 6] => 1 - 3, 4 - 6
      const limit = Number(req.query.limit) || 10;
      // 2 -1 = 1 * 10 => 10
      // 3 -1 = 2 * 10 => 20
      const page = Number(req.query.page) - 1 || 0;

      console.log(req.query);
      console.log(limit, page);
      const users = await usersCollection
        .find({})
        .limit(limit)
        .skip(limit * page)
        .toArray();

      res.send({
        status: "success",
        data: users,
      });
    });

    app.post("/user/create", auth, async (req, res) => {
      const user = await db.collection("users").insertOne({
        name: "Shadath",
        email: "shadath@gmail.com",
        password: 123456,
      });
      res.send({
        message: "User Created Successfully",
        data: user,
      });
    });

    // Register
    app.post("/register", async (req, res) => {
      console.log(req.body);
      const { name, email, password } = req.body;

      const user = await db.collection("users").insertOne({
        name,
        email,
        password,
      });
      res.send({
        message: "User Created Successfully",
        data: user,
      });
    });
    // Login
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;
      console.log(email, password);

      if (!email || !password) {
        return res.send({
          status: "error",
          message: "Please provide all the values",
        });
      }

      const hasUser = await usersCollection.findOne({
        email,
        password: Number(password),
      });

      if (!hasUser) {
        return res.send({
          status: "Error",
          message: "Invalid Credential",
        });
      }

      /***
      1. validate body
      2. find the user
      3. if user not found, send invalid error respose
      4. user found
      5. create token
      6. send response
      ***/
      delete hasUser.password;
      // const tokenObj = {
      //   email: hasUser.email,
      //   _id,
      // };
      const token = jwt.sign(hasUser, process.env.JWT_SECRET);
      console.log(token);

      res.send({
        status: "User Login Successfully",
        data: hasUser,
        token,
      });
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  client.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to Mongodb");
    }
    // perform actions on the collection object
    // client.close();
  });
  console.log("Server Is Running " + process.env.PORT);
});
