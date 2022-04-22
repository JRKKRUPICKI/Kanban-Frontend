import '../App.scss';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/Auth';

export default function NavBar(){

    const auth = useAuth();

    return(
        <div className='navigation'>
            <Link className='link' to='/'>Tablica</Link>
            {auth.user ? (
                <>
                <Link className='link' to='/profile'>Profil</Link>
                <div className='link' onClick={auth.logout}>Wyloguj się</div>
                </>
            ) : (
                <>
                <Link className='link' to='/login'>Login</Link>
                <Link className='link' to='/register'>Register</Link>
                </>
            )}
        </div>
    );
}
