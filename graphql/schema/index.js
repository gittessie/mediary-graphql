const { buildSchema } = require("graphql");

module.exports = buildSchema(`
        type User{
          _id: ID! 
          name: String!
          email: String!
          password: String
        }

        input UserInput{
          name: String!
          email: String!
          password: String!
        }

        type Movie {
            _id: ID!
            title: String!
            year: Int
        }

        type Review {
            _id: ID!
            rating: Int!
            reviewText: String
            movie: Movie!
            reviewer: User!
            createdAt: String!
            updatedAt: String!
        }

        type AuthData {
            userID: ID!
            token: String!
            sessionExpiry: Int!
        }
 
        type Query {
            movies: [Movie!]!
            users: [User!]!
            reviews: [Review!]!
            login(email: String!, password: String!): AuthData!
        }

        type Mutation {
            addMovie(title: String!, year: Int): Movie
            createUser(userInput: UserInput): User
            reviewMovie(movieID: ID!, rating: Int!, reviewText: String): Review
            removeReview(reviewID: ID!): Movie!
        }

        schema {
            query: Query
            mutation: Mutation
        }
    `);
