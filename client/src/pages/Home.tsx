import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  DataTable,
  FormField,
  Heading,
  Layer,
  RangeInput,
  TextArea,
  TextInput,
  Meter,
} from "grommet";
import { Close, Add } from "grommet-icons";
import { GRAPHQL_API_ENDPOINT } from "../constants";
import { AppStateContext } from "../App";

const columns = [
  {
    property: "key",
    header: "",
    primary: true,
  },
  {
    property: "title",
    header: "Title",
    primary: true,
  },
  {
    property: "year",
    header: "Year",
    primary: true,
  },
  {
    property: "rating",
    header: "Rating",
    render: (datum: any) => (
      <Box pad={{ vertical: "xsmall" }} alignSelf="center">
        <Meter
          values={[{ value: datum.rating * 20 }]}
          thickness="small"
          size="xxsmall"
          type="circle"
        />
      </Box>
    ),
  },
  {
    property: "reviewText",
    header: "Review",
  },
];

type MovieReview = {
  id: string;
  title: string;
  year: number;
  rating: number;
  textReview: string;
};

const Home: React.FC = () => {
  const [movies, setMovies] = useState<MovieReview[]>([]);
  const [open, setOpen] = React.useState(false);
  const [movieTitle, setMovieTitle] = useState("");
  const [movieYear, setMovieYear] = useState(2020);
  const [movieRating, setMovieRating] = useState(1);
  const [movieReview, setMovieReview] = useState("");
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const [error, setError] = useState("");

  const { token } = useContext(AppStateContext);

  const onOpen = () => setOpen(true);

  const onClose = () => setOpen(false);

  //useEffect(() => {}, []);

  useEffect(() => {
    if (movieTitle.trim()) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [movieTitle]);

  const createMovie = async (): Promise<String> => {
    const requestBody = {
      query: `
        mutation {
          addMovie(title: "${movieTitle}", year: ${movieYear}){
            _id
          }
        }`,
    };
    try {
      const response = await fetch(`${GRAPHQL_API_ENDPOINT}`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.log("failed to create movie");
        setError("An error occurred. Try again.");
      } else {
        const responseData = await response.json();
        return responseData.data.addMovie._id;
      }
    } catch (e) {
      console.log(e);
      setError(e);
    }
    return "";
  };

  const addMovieReview = async () => {
    setError("");
    if (isButtonDisabled) {
      return;
    }
    const movieID = await createMovie();
    if (movieID === "") {
      return;
    }
    const requestBody = {
      query: `
      mutation {
        reviewMovie(movieID: "${movieID}", rating: ${movieRating}, reviewText: "${movieReview}"){
          _id
        }
      }`,
    };
    try {
      const response = await fetch(`${GRAPHQL_API_ENDPOINT}`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.log("failed to add review to movie");
        setError("An error occurred. Try again.");
        return;
      } else {
        const responseData = await response.json();
        const newMovie = {
            id: responseData.data.reviewMovie._id,
          title: movieTitle,
          year: movieYear,
          rating: movieRating,
          textReview: movieReview,
        };
        setMovies((movies) => movies.concat(newMovie));
      }
    } catch (e) {
      console.log(e);
      setError(e);
      return;
    }
    setOpen(false);
  };

  return (
    <Box fill align="center" justify="center" pad="large">
      <h1>
        Your Movie Reviews
        <Button
          size="large"
          icon={<Add />}
          onClick={onOpen}
          primary
          margin="0 0 0 15px"
        />
      </h1>
      {movies.length < 1 && (
        <h3>You don't have any reviews yet! Click + to start adding some!</h3>
      )}
      <Box fill="vertical" overflow="auto" width="large">
        <DataTable
          columns={columns}
          data={movies}
          step={10}
          onMore={() => {}}
        />
      </Box>
      {open && (
        <Layer
          position="right"
          full="vertical"
          modal
          onClickOutside={onClose}
          onEsc={onClose}
        >
          <Box fill="vertical" overflow="auto" width="medium" pad="medium">
            <Box flex={false} direction="row" justify="between">
              <Heading level={2} margin="none">
                Add
              </Heading>
              <Button icon={<Close />} onClick={onClose} />
            </Box>
            <Box flex="grow" overflow="auto" pad={{ vertical: "medium" }}>
              {error && <div>{error}</div>}
              <FormField label="Movie Title" required>
                <TextInput
                  value={movieTitle}
                  onChange={(e: any) => setMovieTitle(e.target.value)}
                />
              </FormField>
              <FormField label="Movie Release Year" required>
                <TextInput
                  value={movieYear}
                  onChange={(e: any) => setMovieYear(e.target.value)}
                />
              </FormField>
              <FormField label={`Rating: ${movieRating}`} required>
                <RangeInput
                  min={1}
                  max={5}
                  step={1}
                  value={movieRating}
                  onChange={(e: any) => setMovieRating(e.target.value)}
                />
              </FormField>
              <FormField label="Review">
                <TextArea
                  value={movieReview}
                  onChange={(e: any) => setMovieReview(e.target.value)}
                />
              </FormField>
            </Box>
            <Box flex={false} as="footer" align="start">
              <Button
                label="Submit"
                onClick={addMovieReview}
                primary
                disabled={isButtonDisabled}
              />
            </Box>
          </Box>
        </Layer>
      )}
    </Box>
  );
};

export default Home;
