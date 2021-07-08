const express = require("express");
const mongoose = require("mongoose");

import { ApolloServer, gql } from "apollo-server-express";
import resolvers from "./graphql/index";
import { readFileSync } from "fs";
import { join } from "path";

require("dotenv").config();

const app = express();

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.md3ui.mongodb.net/colorgrad`,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
    }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log(`
  ███╗░░░███╗░█████╗░███╗░░██╗░██████╗░░█████╗░██████╗░██████╗░
  ████╗░████║██╔══██╗████╗░██║██╔════╝░██╔══██╗██╔══██╗██╔══██╗
  ██╔████╔██║██║░░██║██╔██╗██║██║░░██╗░██║░░██║██║░░██║██████╦╝
  ██║╚██╔╝██║██║░░██║██║╚████║██║░░╚██╗██║░░██║██║░░██║██╔══██╗
  ██║░╚═╝░██║╚█████╔╝██║░╚███║╚██████╔╝╚█████╔╝██████╔╝██████╦╝
  ╚═╝░░░░░╚═╝░╚════╝░╚═╝░░╚══╝░╚═════╝░░╚════╝░╚═════╝░╚═════╝░`);
});

const server = new ApolloServer({
    typeDefs: gql(readFileSync(join(__dirname, "../schema.graphql"), "utf8")),
    resolvers,
    context: async ({ req }) => ({
        req,
    }),
});

app.use("/files", express.static(__dirname + "/files"));

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => {
    console.log(
        `🚀  Server ready at http://localhost:4000${server.graphqlPath}`
    );
});
