import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BoardPage from './pages/BoardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RequireAuth from './auth/RequireAuth';
import { AuthProvider } from './auth/Auth';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';

export default function App(){

    return(
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<HomePage/>}/>
                    <Route path='/board' element={<RequireAuth><BoardPage/></RequireAuth>}/>
                    <Route path='/profile' element={<RequireAuth><ProfilePage/></RequireAuth>}/>
                    <Route path='/login' element={<LoginPage/>}/>
                    <Route path='/register' element={<RegisterPage/>}/>
                    <Route path='*' element={<>404</>}/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
