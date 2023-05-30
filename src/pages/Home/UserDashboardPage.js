import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useEffect, useState } from 'react';
import { getOwnedAssets } from '../../services/apiService';

const UserDashboardPage = () => {
    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL
    const { user, loading } = useAuthContext()
    const [ownedAssets, setOwnedAssets] = useState([]);
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        if (!loading) {
            // Fetch assets from the API
            getOwnedAssets(user.id)
                .then((response) => {
                    // Set assets state
                    console.log(response.data)
                    setOwnedAssets(response.data)

                })
                .catch((error) => {
                    // Handle error here
                    setError(error.message)
                    console.log(error.message)
                })
                .finally(() => {
                    // Add page loading here
                })
        }
        // eslint-disable-next-line
    }, [loading]);

    if (loading) {
        // Render a loading animation or placeholder image while fetching assets
        return <div>Loading...</div>;
    }
    if (user && !loading) {
        return (
            <div style={{ textAlign: 'center' }}>
                <h6>This is the user dashboard and should only be seen by logged in user</h6>
                <div className='container'>
                    <div className='row'>
                        <div className='col-lg-6'>
                            <div className="card">
                                <div className="card-header">
                                    UserData
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item"><b>User ID:</b> {user.id}</li>
                                    <li className="list-group-item"><b>Username:</b> {user.username}</li>
                                    <li className="list-group-item"><b>Role:</b> {user.role}</li>
                                    <li className="list-group-item"><b>Token Issued At:</b> {user.iat}</li>
                                    <li className="list-group-item"><b>Token Expires At:</b> {user.exp}</li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-lg-6'>
                            <div className="card">
                                <div className="card-header">
                                    UserData
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item"><b>User ID:</b> {user.id}</li>
                                    <li className="list-group-item"><b>Username:</b> {user.username}</li>
                                    <li className="list-group-item"><b>Role:</b> {user.role}</li>
                                    <li className="list-group-item"><b>Token Issued At:</b> {user.iat}</li>
                                    <li className="list-group-item"><b>Token Expires At:</b> {user.exp}</li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-lg-12'>
                            <div className="card">
                                <div className="card-header">
                                    Owned Assets
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item"><b>User ID:</b> {user.id}</li>
                                    {ownedAssets.map((asset) => (
                                        <li className='list-group-item'>
                                            <div className='row'>
                                                <div className='col-lg-3'>
                                                    <img style={{ width: '100%', maxHeight: '100px', position: 'relative', objectFit: 'cover' }} src={SERVER_BASE_URL + asset.asset.presentationUrl} alt={asset.asset.title} />
                                                </div>
                                                <div className='col-lg-3'>
                                                    {asset.asset.title}
                                                </div>
                                                <div className='col-lg-3'>
                                                    {asset.asset.description}
                                                </div>
                                                <div className='col-lg-3'>
                                                    {asset.ownershipType}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                    {error && (<div>{error}</div>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    // If user not logged in navigate to the login
    navigate('/login')
    return null
}

export default UserDashboardPage