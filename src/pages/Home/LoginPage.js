import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '../../hooks/useAuthContext';

import LoginForm from '../../components/Home/LoginForm/LoginForm';

const LoginPage = () => {
    const { user, loading } = useAuthContext()
    const navigate = useNavigate()


    if (!user && !loading) {
        return (
            <div className='container' style={{ textAlign: 'center' }}>
                <h3>This is login page and should only be seen by not logged in</h3>
                <LoginForm></LoginForm>
            </div>
        )
    }
    // If user is logged in, navigate index
    navigate('/');
    return null; // or any other content you'd like to render for logged-in users
}

export default LoginPage