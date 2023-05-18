import { useState } from 'react';

import { useSignup } from '../../../hooks/useSignup';

const SignupForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signupUser, isLoading, error } = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const signupDetails = {
            username,
            email,
            password
        }
        signupUser(signupDetails)
    };
    return (
        <div>
            <div className='form-container row justify-content-center'>
                <div className='col-md-4'>
                    <form onSubmit={handleSubmit}>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingInput"
                                placeholder="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <label for="floatingInput">Username</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="floatingInput"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label for="floatingInput">Email address</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingInput"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label for="floatingInput">Password</label>
                        </div>
                        <div className='form-group'>
                            <button type="submit" className="btn btn-secondary btn-lg">Sign up</button>
                        </div>
                    </form>
                    {error && (
                        <div className="alert alert-danger" role="alert" style={{ marginTop: '15px' }}>
                            {error}
                        </div>)}
                    <div>{isLoading ? 'LOADING' : 'NOT LOADING'}</div>
                </div>
            </div>
        </div>
    )
}

export default SignupForm