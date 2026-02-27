import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header.jsx';
import './Auto.css'

export default function Auto() {
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        
        if (!formData.login.trim()) {
            newErrors.login = 'Логин обязателен';
        }
        
        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        }
        
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (serverError) {
            setServerError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                navigate('/');
            } else {
                setServerError(result.error || 'Ошибка входа');
            }
        } catch (error) {
            setServerError('Ошибка соединения с сервером');
        }
    };

    return (
        <>
        <Header></Header>
        
        <div className="auth-container">
            
            <h2>Вход в систему</h2>
            
            {serverError && <div className="error-server">{serverError}</div>}
            
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Логин</label>
                    <input
                        type="text"
                        name="login"
                        value={formData.login}
                        onChange={handleChange}
                        className={errors.login ? 'error' : ''}
                    />
                    {errors.login && <span className="error-msg">{errors.login}</span>}
                </div>

                <div className="form-group">
                    <label>Пароль</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? 'error' : ''}
                    />
                    {errors.password && <span className="error-msg">{errors.password}</span>}
                </div>

                <button type="submit" className="btn-primary">Войти</button>
            </form>
            
            <div className="switch-auth">
                <span>Нет аккаунта? </span>
                <Link to="/registration">Зарегистрируйтесь</Link>
            </div>
        </div>
        </>
    );
}