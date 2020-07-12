import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Hide, View } from "grommet-icons";
import { Box, Form, FormField, TextInput, Button } from "grommet";
import { Spinning } from "grommet-controls";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [reveal, setReveal] = React.useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (email.trim() && password.trim()) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [email, password]);

  const handleLogin = async (): Promise<void> => {
    setLoading(true);
    const response = { code: 200 };
    if (response.code === 200) {
      //login
    } else {
      setError("Invalid credentials.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.keyCode === 13 || e.which === 13) {
      isButtonDisabled || handleLogin();
    }
  };

  return (
    <div>
      {error && <div>{error}</div>}
      <h1>Sign In</h1>
      <Form>
        <FormField htmlFor="emailInput" label="Email">
          <TextInput
            plain
            id="emailInput"
            onChange={(e): void => setEmail(e.target.value)}
            onKeyPress={(e): void => handleKeyPress(e)}
            name="email"
            value={email}
            type="text"
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
          label={isLoading ? <Spinning kind="circle" color="active" /> : "SIGN IN"}
          onClick={(): Promise<void> => handleLogin()}
          disabled={isButtonDisabled}
          margin="0 20px 0 0"
        />
        
        <Link to="/auth/register">Create an Account</Link>
      </Form>
    </div>
  );
};

export default Login;
