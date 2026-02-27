import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header.jsx';

export default function Reg() {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        fullName: '',
        phone: '',
        email: ''
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
        } else if (formData.password.length < 8) {
            newErrors.password = 'Минимум 8 символов';
        }
        
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'ФИО обязательно';
        } else if (!/^[а-яА-ЯёЁ\s]+$/.test(formData.fullName)) {
            newErrors.fullName = 'Только кириллица и пробелы';
        }
        
        if (!formData.phone.trim()) {
            newErrors.phone = 'Телефон обязателен';
        } else if (!/^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/.test(formData.phone)) {
            newErrors.phone = 'Формат: +7(XXX)-XXX-XX-XX';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email обязателен';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Неверный формат email';
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
            const response = await fetch('http://localhost:5000/registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                navigate('/login');
            } else {
                setServerError(result.error || 'Ошибка регистрации');
            }
        } catch (error) {
            setServerError('Ошибка соединения с сервером');
        }
    };

    return (
        <>
         <Header></Header>
        
        <div className="reg-container">
           
            <h2>Регистрация</h2>
            
            {serverError && <div className="error-server">{serverError}</div>}
            
            <form onSubmit={handleSubmit} className="reg-form">
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

                <div className="form-group">
                    <label>ФИО</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={errors.fullName ? 'error' : ''}
                    />
                    {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                    <label>Телефон</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+7(XXX)-XXX-XX-XX"
                        className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-msg">{errors.phone}</span>}
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                </div>

                <button type="submit" className="btn-primary">Зарегистрироваться</button>
            </form>
            
            <div className="switch-auth">
                <span>Есть аккаунт? </span>
                <Link to="/login">Войти</Link>
            </div>
        </div>
        </>
    );
}