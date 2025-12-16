import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './utils/Protection'
import Navbar from './components/Navbar'
import Group from './pages/Group'
import DashBoard from './pages/DashBoard'
import GroupDetail from './pages/GroupDetail'
import GlobalLeaderboard from './pages/GlobalLeaderBoard'
import Profile from './pages/Profile'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/groups' element={
          <ProtectedRoute>
            <Group />
          </ProtectedRoute>
        } />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:groupId"
          element={
            <ProtectedRoute>
              <GroupDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <GlobalLeaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


      </Routes>
    </>
  )
}

export default App
