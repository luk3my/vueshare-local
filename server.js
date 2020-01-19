const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

//Import typeDefs and resolvers
const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers");

//Import environment variables and mongoose models
require("dotenv").config({ path: "variables.env" });
const User = require("./models/User");
const Post = require("./models/Post");

//Connect to Mongo Atlas Database
mongoose
  .connect(process.env.MONGO_URI, { autoIndex: false, useNewUrlParser: true })
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));

//Verify JWT token passed from client
const getUser = async token => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (err) {
      throw new AuthenticationError('Your session has ended. Please sign in again')
    }
  }
};

// Create Apollo/GraphQl Server using typeDefs, resolvers and contect object
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers["authorization"];
    return { User, Post, currentUser: await getUser(token) };
  }
});

//Listen on port localhost:4000
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server Listening ${url}`);
});
