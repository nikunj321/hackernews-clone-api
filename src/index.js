const { ApolloServer } = require("apollo-server");
const { PrismaClient, Prisma } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();
const resolvers = {
  Query: {
    info: () => `This is the api of the hackerNews clone`,
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany();
    },
    link: (_, args) => {
      for (let link of Links) {
        if (link.id === args.id) return link;
      }
    },
  },
  Mutation: {
    post: (_, args, context) => {
      const newLink = context.prisma.link.create({
        data: {
          desciption: args.desciption,
          url: args.url,
        },
      });
      return newLink;
    },
    updateLink: (_, { id, url, description }) => {
      for (let link of Links) {
        if (link.id === id) {
          (link.url = url), (link.description = description);
          return link;
        }
      }
    },
    deleteLink: (_, { id }) => {
      for (let i = 0; i < Links.length; i++) {
        if (Links[i].id === id) {
          return Links.splice(i, 1);
        }
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => console.log(`server is running on ${url}`));
