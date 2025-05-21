
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Auth from './Auth';

const AuthPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Sign In | Wrenchmark</title>
      </Helmet>
      
      <Auth />
    </>
  );
};

export default AuthPage;
