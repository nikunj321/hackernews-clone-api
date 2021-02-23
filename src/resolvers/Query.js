async function feed(parent, args, context) {
  const where = args.filter
    ? {
        OR: [
          { description: { contains: args.filter } },
          { url: { contains: args.url } },
        ],
      }
    : {};

  const links = await context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.skip,
    orderBy: args.orderBy,
  });

  const count = context.prisma.link.count({ where });
  return {
    links,
    count,
  };
}

module.exports = {
  feed,
};
