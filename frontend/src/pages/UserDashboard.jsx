import React from 'react'
import { getUser, clearSession } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

const UserDashboard = () => {
  const user = getUser()
  const navigate = useNavigate()

  function handleLogout(){
    clearSession();
    navigate('/login')
  }

  return (
    <div className="card shadow-sm border-0 p-4" style={{ maxWidth: 500, margin: '20px auto' }}>
      <h4 className="mb-3">Welcome, {user?.name}</h4>
      <p className="mb-3">Role: <strong>{user?.role}</strong></p>
      <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default UserDashboard
