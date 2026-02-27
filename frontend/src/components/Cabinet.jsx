import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';
import './Cabinet.css';

export default function Cabinet() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            if (!base64Url) return null;
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    };

    const formatPhone = (phone) => {
        if (!phone) return '—';
        const digits = phone.toString().replace(/\D/g, '');
        if (digits.length < 10) return phone;
        return `+7(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    navigate('/login');
                    return;
                }

                const decodedUser = parseJwt(token);

                if (!decodedUser) {
                    throw new Error('Неверный формат токена');
                }

                if (decodedUser.exp && decodedUser.exp * 1000 < Date.now()) {
                    localStorage.clear();
                    navigate('/login');
                    return;
                }

                if (decodedUser.phone && decodedUser.email) {
                    setUser(decodedUser);
                } else {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        setUser({
                            userId: decodedUser.userId,
                            login: 'test_user',
                            email: 'test@example.com',
                            phone: '79991234567',
                            fullName: 'Иван Иванов'
                        });
                    }
                }
            } catch (err) {
                console.error(err);
                setError('Ошибка загрузки данных');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (loading) {
        return <div className="cabinet-loading">Загрузка...</div>;
    }

    if (error && !user) {
        return (
            <div className="cabinet-error">
                <p>{error}</p>
                <button onClick={() => navigate('/login')}>Войти</button>
            </div>
        );
    }

    return (
        <div className="cabinet-container">
            <Header />
            <h1>Личный кабинет</h1>
            
            <div className="user-card">
                <div className="user-field">
                    <label>Логин</label>
                    <p>{user?.login || user?.username || '—'}</p>
                </div>
                
                <div className="user-field">
                    <label>Email</label>
                    <p>{user?.email || '—'}</p>
                </div>
                
                <div className="user-field">
                    <label>Телефон</label>
                    <p>{formatPhone(user?.phone)}</p>
                </div>
                
                <div className="user-field">
                    <label>Имя</label>
                    <p>{user?.fullName || user?.name || '—'}</p>
                </div>
            </div>
        </div>
    );
}