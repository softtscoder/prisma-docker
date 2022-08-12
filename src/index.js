const { GraphQLServer, PubSub } = require('graphql-yoga')
const { RedisPubSub } = require('graphql-redis-subscriptions')
const { Prisma } = require('prisma-binding')
const resolvers = require('./resolvers')
const redis = require('redis')
const bluebird = require('bluebird')

// following
// https://github.com/prisma/graphql-yoga/tree/master/examples/subscriptions

bluebird.promisifyAll(redis);
// when running the gql-server ouside the docker-compse use: 
// const client = redis.createClient()
const client = redis.createClient()

// when running gql-server inside docker-compose use: const client = redis.createClient('6379','redis')
// const client = redis.createClient('6379','redis')

// FYI
// HTTP:  http://localhost:4466
//   WS:    ws://localhost:4466

// new pubsub instance from graphql-yoga 
//const pubsub = new PubSub()

// it's reccomdend to use RedisPubSub in production 
const pubsub = new RedisPubSub()

const db = new Prisma({
  // the auto-generated GraphQL schema of the Prisma API
  typeDefs: 'src/generated/prisma.graphql',
  // "http://localhost:4466" if server is not docker-compose up'd
  // "http://prisma:4466" if server is docker-composed up
  endpoint: "http://localhost:4466",
  //endpoint: "http://prisma:4466", // "http://prisma:4466" the endpoint of the Prisma API (value set in `.env`)
  debug: true, // log all GraphQL queries & mutations sent to the Prisma API
  secret: "mysecret123", // only needed if specified in `database/prisma.yml` (value set in `.env`)
})

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({ ...req, db, client, pubsub }),
})
// middlewear for static files.
// must install express and import with 'require' syntax
// server.express.use("/images", express.static("images"));

server.start(() => console.log(`

##################################################
##                                              ##
##  Server is running on http://localhost:4000  ##
##                                              ##
##################################################

`))
