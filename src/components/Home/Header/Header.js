import './Header.css'
import { useLogout } from '../../../hooks/useLogout';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useCartContext } from '../../../hooks/useCartContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user } = useAuthContext()
    const { cartItems } = useCartContext()
    const { logoutUser } = useLogout()
    const navigate = useNavigate()

    return (
        <div className='header-container'>
            <div className='container'>
                <div className='row justify-content-between align-items-center'>
                    <div className='col-lg-2'>
                        <a href="/"><img src='https://www.saruhanweb.com/images/saruhanweb-logo.png' alt="SW Logo"></img></a>
                    </div>
                    <div className='col-lg-2'>
                        This is the header
                    </div>
                    <div className='col-lg-3'>
                        {user && <div>{user.id} {user.username}</div>}
                    </div>
                    <div className='col-lg-4'>
                        {user && <div>
                            <button className='btn btn-warning' onClick={() => { navigate('/dashboard') }}>User Dashboard</button>
                            <button className='btn btn-success' onClick={() => { navigate('/upload-asset') }}>Upload Asset</button>
                            <button className='btn btn-danger' onClick={() => { logoutUser() }}>Logout</button>
                        </div>}
                        {!user && <div>
                            <button className='btn btn-success' onClick={() => { navigate('/login') }}>Login</button>
                        </div>}
                    </div>
                    <div className='col-lg-1'>
                        <button type="button" className="btn btn-secondary"
                            onClick={() => { navigate('/cart') }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                            </svg>
                            {cartItems.length}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;