import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

import SignupForm from "../../components/Home/SignupForm/SignupForm"

const SignupPage = () => {
    const { user, loading } = useAuthContext()
    const navigate = useNavigate()

    if (!user && !loading) {
        return (
            <div className='container' style={{ textAlign: 'center' }}>
                <h3>This is the signup page and should only be seen by not logged in users</h3>
                <SignupForm></SignupForm>
            </div>
        )
    }
    // If user is logged in, navigate index
    navigate('/');
    return null; // or any other content you'd like to render for logged-in users
}

export default SignupPage