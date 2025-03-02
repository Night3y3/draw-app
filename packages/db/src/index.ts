const { PrismaClient } = require("@prisma/client");

const prismaCLient = new PrismaClient();

module.exports = prismaCLient;
