const { ApolloServer, PubSub } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");

const fs = require("fs");
const path = require("path");
const { getUserId } = require("./utils");

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Link = require("./resolvers/Link");
const User = require("./resolvers/User");
const Subscription = require("./resolvers/Subscription");

// initialization
const prisma = new PrismaClient();
const pubsub = new PubSub();

const resolvers = {
  Query,
  Mutation,
  Subscription,
  Link,
  User,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      // direct extracting userId using `getUserId` function
      // and we will user directly in Mutation.js>>post function
      // where const { userId } = context;
      userId: req && req.headers.authorization && getUserId(req),
    };
  },
});

server.listen().then(({ url }) => console.log(`server is running on ${url}`));
