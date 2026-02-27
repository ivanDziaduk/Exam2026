import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Header.css';
import logo from '../assets/logo.svg';

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token) {
            setIsAuth(true);
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } else {
            setIsAuth(false);
            setUser(null);
        }
    }, [location]);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const handleLogout = () => {
        localStorage.clear();
        setIsAuth(false);
        setUser(null);
        navigate('/login');
    };

    const handleCabinetClick = (e) => {
        if (!isAuth) {
            e.preventDefault();
            navigate('/login');
        }
    };

    return (
        <header className="header">
            <div className="header-container">
                
                <Link to="/" className="logo">
                    <img src={logo} alt="Логотип" />
                    Банкетам.нет
                </Link>
                
                <nav className="nav">
                    <Link to="/" className={isActive('/')}>
                        Главная
                    </Link>
                    
                    <Link 
                        to="/cabinet" 
                        className={isActive('/cabinet')}
                        onClick={handleCabinetClick}
                    >
                        Кабинет
                    </Link>

                    {user?.role === 'admin' && (
                        <Link to="/admin" className={isActive('/admin')}>
                            Админ панель
                        </Link>
                    )}
                    
                    {isAuth ? (
                        <button onClick={handleLogout} className="btn-logout">
                            Выйти
                        </button>
                    ) : (
                        <>
                            <Link to="/registration" className={isActive('/registration')}>
                                Вход в систему
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}