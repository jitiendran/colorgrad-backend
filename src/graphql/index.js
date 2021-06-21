const path = require("path");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { print } = require("graphql");
const fs = require("fs");

const loadedFiles = loadFilesSync(path.join(__dirname, "models/**/*.graphql"));
const resolversArray = loadFilesSync(path.join(__dirname, "./resolvers"));

// console.log(resolversArray);

const typeDefs = mergeTypeDefs(loadedFiles);
const printedTypeDefs = print(typeDefs);
fs.writeFileSync("schema.graphql", printedTypeDefs);

module.exports = mergeResolvers(resolversArray);
