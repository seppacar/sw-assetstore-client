import AssetUploadForm from "../../components/Home/AssetUploadForm/AssetUploadForm"
import { useAuthContext } from "../../hooks/useAuthContext"
import { useNavigate } from "react-router-dom"

const UploadAssetPage = () => {
    const { user, loading } = useAuthContext()
    const navigate = useNavigate()

    if (user && !loading) {
        return (
            <div style={{ textAlign: 'center' }}>
                <h3>This is new asset upload page and should only be seen by <b>logged in</b></h3>
                <AssetUploadForm></AssetUploadForm>
            </div>
        )
    }
    
    // If user not logged in navigate to the login
    navigate('/login')
    return null

}

export default UploadAssetPage