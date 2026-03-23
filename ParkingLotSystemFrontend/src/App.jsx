import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ParkingLots from './pages/ParkingLots'
import ParkingSpots from './pages/ParkingSpots'
import Vehicles from './pages/Vehicles'
import Tickets from './pages/Tickets'
import Fees from './pages/Fees'
import Invoices from './pages/Invoices'
import Users from './pages/Users'
import RoleAccess from './pages/RoleAccess'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="parking-lots" element={<ParkingLots />} />
        <Route path="parking-spots" element={<ParkingSpots />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="fees" element={<Fees />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="users" element={<Users />} />
        <Route path="role-access" element={<RoleAccess />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
