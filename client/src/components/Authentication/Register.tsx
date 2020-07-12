import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Hide, View } from "grommet-icons";
import { Box, Form, FormField, TextInput, Button } from "grommet";
import { Spinning } from "grommet-controls";
import { GRAPHQL_API_ENDPOINT } from '../../constants';

const Register: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [reveal, setReveal] = React.useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (email.trim() && password.trim() && name.trim()) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [email, password, name]);

  const handleRegister = async (): Promise<void> => {
    setLoading(true);
    const requestBody = {
      query: `
        mutation {
          createUser(userInput: {name: "${name}", email: "${email}", password: "${password}"}){
            _id
            email
          }
        }
      `
    }
    try{
      const response = await fetch(`${GRAPHQL_API_ENDPOINT}`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setLoading(false);
      if(!response.ok){
        setError('Account Registration Failed. Try Again.');
      }else{
        const responseData = await response.json();
        console.log(responseData);
      }
    }catch(e){
      console.log(e);
      setError(e);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.keyCode === 13 || e.which === 13) {
      isButtonDisabled || handleRegister();
    }
  };

  return (
    <div>
      {error && <div>{error}</div>}
      <h1>Create an Account</h1>

      <Form onSubmit={handleRegister}>
        <FormField htmlFor="nameInput" label="Name">
          <TextInput
            plain
            id="nameInput"
            onChange={(e): void => setName(e.target.value)}
            onKeyPress={(e): void => handleKeyPress(e)}
            name="name"
            value={name}
            type="text"
          />
        </FormField>
        <br />

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
        <br />

        <Button
          primary
          size="large"
          label={isLoading ? <Spinning kind="circle" color="active" /> : "SIGN UP"}
          disabled={isButtonDisabled}
          margin='0 20px 0 0'
          type='submit'
        />
        <Link to="/auth/login">Already have an account?</Link>
      </Form>
    </div>
  );
};

export default Register;
