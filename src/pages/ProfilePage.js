import { useAuth } from "../auth/Auth"
import NavBar from "../components/NavBar";
import './ProfilePage.scss';

export default function Profile(){
    const auth = useAuth();
    return(
        <>
        <NavBar/>
        <div className='profilepage'>
            <div className='email'>
                Zalogowany jako: <b>{auth.user.email}</b>
            </div>
        </div>
        </>
    )
}
