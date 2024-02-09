import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useParams } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import SignUpForm from './components/AdminSuper';

const PrivateRoute = ({ component: Component, ...props }) => {
  const { User } = useParams();
  const { token, loading , user ,displayName} = useAuth();
  if (loading) {
    // If still loading, you can render a loading indicator or null
    return <TailSpin />;
  }

  if (!token || User !== displayName && displayName !== "אליעד שחר") {
    // Redirect to the login page if no token is present
    return <Navigate to="/" />;
  }
if (displayName === "אליעד שחר" && User === "אליעד שחר"){
  return <SignUpForm /> ;
}
  // If the token is present and loading is complete, render the protected component
  return <Component {...props} />;
};

export default PrivateRoute;


