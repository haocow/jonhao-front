import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import './App.scss';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Header />
        <div className='content'>
          <Switch>
            <Route component={NotFoundPage} />
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
