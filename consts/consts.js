const SECRET = "HELLOTHISISASECRET"

module.exports = SECRET;

const { PrismaClient }  = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = prisma

const express = require('express');

module.exports = express