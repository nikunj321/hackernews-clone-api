const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function post(_, { url, description }, context) {
  const { userId } = context;
  // here userId is 1 because right now we have only one user
  // console.log(userId);

  const newLink = await context.prisma.link.create({
    data: {
      url: url,
      description: description,
      postedBy: {
        connect: { id: userId },
      },
    },
  });
  context.pubsub.publish("NEW_LINK", newLink);

  return newLink;
}

module.exports = {
  post,
  login,
  signup,
};
