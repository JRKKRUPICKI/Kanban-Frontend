import { Link } from 'react-router-dom';
import { useAuth } from '../auth/Auth';
import BoardPage from './BoardPage';
import './HomePage.scss';

export default function HomePage(){

    const auth = useAuth();

    if(auth.user) return <BoardPage/>

    return(
        <div className='homepage'>
            <div className='title'>KANBAN</div>
            <div className='buttons'>
                <Link className='link' to='/login'>Logowanie</Link>
                <Link className='link' to='/register'>Rejestracja</Link>
            </div>
        </div>
    )
}
