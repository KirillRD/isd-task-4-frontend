import 'primereact/resources/themes/soho-light/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup';
import { ApiRoutes } from './utils/constant'
import { ProtectedRoute } from './components/ProtectedRoute'
import { UserManagement } from './pages/UserManagement';
import { useUserContext } from './context/userContext'
import { GuestRoute } from './components/GuestRoute';
import { NotFound } from './pages/NotFound';
import { Navbar } from './components/Navbar';

export const App = () => {
  const { user } = useUserContext();

  return (
    <>
      <main className='p-component surface-ground text-color flex flex-column min-h-screen'>
        {user && <Navbar />}
        <Routes>
          <Route path={ApiRoutes.DEFAULT} element={!user ? <Navigate to={ApiRoutes.LOGIN} /> : <Navigate to={ApiRoutes.USER_MANAGEMENT} />} />
          <Route path={ApiRoutes.LOGIN} element={<GuestRoute user={user} ><Login /></GuestRoute>} />
          <Route path={ApiRoutes.SIGNUP} element={<GuestRoute user={user} ><Signup /></GuestRoute>} />
          <Route path={ApiRoutes.USER_MANAGEMENT} element={<ProtectedRoute user={user} ><UserManagement /></ProtectedRoute>} />
          <Route path={ApiRoutes.NOT_FOUND} element={<NotFound />}/>
          <Route path='*' element={<Navigate to={ApiRoutes.NOT_FOUND} />} />
        </Routes>
      </main>
    </>
  )
}
