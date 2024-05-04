import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PrivateRoute from './components/auth/PrivateRoute';
import PublicRoute from './components/auth/PublicRoute';
import Header from './components/common/Header';
import './index.css';
import Home from './pages/Home';
import Contract from './pages/Contract';
import Login from './pages/Login';
import PasswordReset from './pages/PasswordReset';
import Signup from './pages/Signup';

const App = () => {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path='/' element={<Home />} />
            <Route path='/contract/:id' element={<Contract />} />
          </Route>
          <Route element={<PublicRoute />}>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/password-reset' element={<PasswordReset />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
