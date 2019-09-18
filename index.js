require('dotenv').config()
const express = require('express')
const graphqlHTTP = require('express-graphql')
const { graphql, buildSchema } = require('graphql')
const fs = require('fs')
const bodyParser = require('body-parser')
const db = require('./models')
const authenticateMW = require('./middlewares/authenticate')

const graphQlResolvers = require('./graphql/resolvers')

const schemaString = fs.readFileSync('./graphql/schema.graphql', {
  encoding: 'utf8'
})

const MyGraphQLSchema = buildSchema(schemaString)

const app = express()

app.use(bodyParser.json())

app.use(authenticateMW)
app.use(
  '/graphql',
  graphqlHTTP({
    schema: MyGraphQLSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  }),
)

app.listen(process.env.SERVER_PORT || 4000, () => {
  console.log('Server started listening....')
})
