import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';
import './Admin.css';

export default function Admin() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = () => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');

            if (!token || !user) {
                navigate('/login');
                return;
            }

            try {
                const userData = JSON.parse(user);
                if (userData.role !== 'admin') {
                    navigate('/');
                    return;
                }
                setIsLoading(false);
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        };

        checkAdmin();
    }, [navigate]);

    if (isLoading) {
        return <div className="admin-container">Загрузка...</div>;
    }

    return (
        <div className="admin-container">
            <Header></Header>
            <h1>Панель администратора</h1>
            <div className="admin-info">
                <p>Ваша роль: администратор</p>
            </div>
        </div>
    );
}