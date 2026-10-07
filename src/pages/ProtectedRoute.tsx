import type React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ isAuth, children }: { isAuth: boolean, children: React.ReactNode}) {
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default ProtectedRoute