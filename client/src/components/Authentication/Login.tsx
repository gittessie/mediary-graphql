import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Hide, View } from "grommet-icons";
import { Box, Form, FormField, TextInput, Button } from "grommet";
import { Spinning } from "grommet-controls";
import { GRAPHQL_API_ENDPOINT } from "../../constants";
import { AppStateContext } from "../../App";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [reveal, setReveal] = React.useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { login } = useContext(AppStateContext);

  useEffect(() => {
    if (email.trim() && password.trim()) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [email, password]);

  const handleLogin = async (event: any): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    const requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}"){
            userID
            token
            sessionExpiry
          }
        }
      `,
    };
    try {
      const response = await fetch(`${GRAPHQL_API_ENDPOINT}`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      if (!response.ok) {
        setError("Invalid Credentials.");
      } else {
        const responseData = await response.json();
        console.log(responseData);
        login(
          responseData.data.login.userID,
          responseData.data.login.token,
          responseData.data.login.sessionExpiry
        );
      }
    } catch (e) {
      console.log(e);
      setError(e);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.keyCode === 13 || e.which === 13) {
      isButtonDisabled || handleLogin(e);
    }
  };

  return (
    <div>
      {error && <div>{error}</div>}
      <h1>Sign In</h1>
      <Form onSubmit={handleLogin}>
        <FormField htmlFor="emailInput" label="Email">
          <TextInput
            plain
            id="emailInput"
            onChange={(e): void => setEmail(e.target.value)}
            onKeyPress={(e): void => handleKeyPress(e)}
            name="email"
            value={email}
            type="email"
          />
        </FormField>
        <br />
        <FormField htmlFor="passwordInput" label="Password">
          <Box width="medium" direction="row" align="center">
            <TextInput
              plain
              id="passwordInput"
              onChange={(e): void => setPassword(e.target.value)}
              onKeyPress={(e): void => handleKeyPress(e)}
              name="password"
              value={password}
              type={reveal ? "text" : "password"}
            />
            <Button
              icon={reveal ? <View size="medium" /> : <Hide size="medium" />}
              onClick={() => setReveal(!reveal)}
            />
          </Box>
        </FormField>
        <Button
          primary
          size="large"
          label={
            isLoading ? <Spinning kind="circle" color="active" /> : "SIGN IN"
          }
          disabled={isButtonDisabled}
          margin="0 20px 0 0"
          type="submit"
        />

        <Link to="/auth/register">Create an Account</Link>
      </Form>
    </div>
  );
};

export default Login;
