const Movie = require("../../mongoose/models/movie");

module.exports = {
  movies: async () => {
    if(!req.isAuth){
      throw new Error('Not authorized.');
    }
    try {
      const movies = await Movie.find();
      return movies.map((movie) => ({ ...movie._doc }));
    } catch (e) {
      console.log(e);
    }
  },
  addMovie: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Not authorized.');
    }
    try {
      const movie = new Movie({
        title: args.title,
        year: args.year,
      });
      const result = await movie.save();
      return { ...result._doc };
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
};
