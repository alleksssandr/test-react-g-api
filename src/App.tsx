import './App.css'
import PageAuthorization from './pages/authorization/Authorization'
import PageChat from './pages/chat/Chat'

import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './pages/ProtectedRoute';
import { isAuthorized, useAuthStore } from './store/authStore';

function App() {

  const isAuth = useAuthStore((state) => isAuthorized(state))

  return (
    <>

      <section id="center">
      <Routes>
        <Route
          path="/" 
          element={
            <PageAuthorization />
          }
        />
        <Route
          path="/chat" 
          element={
            <ProtectedRoute isAuth={isAuth}>
              <PageChat />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div style={{ padding: 40 }}>404 — Page not found</div>} />
      </Routes>
      </section>
    </>
  )
}

export default App
