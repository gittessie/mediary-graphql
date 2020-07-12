import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import Authentication from './pages/Authentication';
import Home from './pages/Home';
import Nav from './components/Nav/Nav';
import { Box, Grommet } from 'grommet';

const theme = {
  global: {
    colors: {
      brand: '#b68af2',
      focus: '#f28a91',
      active: '#f28a91',
      text: {
        light: '#271f32',
        dark: '#271f32'
      }
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};

function App() {
  return (
    <Grommet theme={theme} full>
      <Box fill>
        <Nav />
        <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
          <Box flex align='center' justify='center'>
            <Router>
              <Switch>
                <Redirect from='/' to='/auth' exact />
                <Route path='/auth' component={Authentication} />
                <Route path='/movies' component={Home} />
              </Switch>
            </Router>
          </Box>
        </Box>
      </Box>
    </Grommet>
  );
}

export default App;
