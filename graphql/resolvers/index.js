const authResolver = require('./auth');
const movieResolver = require('./movies');
const reviewResolver = require('./reviews');

const rootResolver = {
    ...authResolver,
    ...movieResolver,
    ...reviewResolver
}

module.exports = rootResolver;