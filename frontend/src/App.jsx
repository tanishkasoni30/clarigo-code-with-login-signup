import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './Users'
import CreateUser from './CreateUser'
import UpdateUser from './UpdateUser'
import ProfilePage from './pages/ProfilePage'
import AdminSettings from './pages/AdminSettings'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute roles={['Admin']}><Users /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute roles={['Admin']}><CreateUser /></ProtectedRoute>} />
        <Route path="/update/:id" element={<ProtectedRoute roles={['Admin']}><UpdateUser /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute roles={['Admin']}><AdminSettings /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
