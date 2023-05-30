import { useEffect, useState } from "react";
import AssetCard from "../../components/Home/AssetCard/AssetCard"

import { fetchAssets } from "../../services/apiService"


const LandingPage = () => {
    const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL
    const [loading, setLoading] = useState(true);
    const [assets, setAssets] = useState([]);
    const [error, setError] = useState(null)

    useEffect(() => {
        // Fetch assets from the API
        fetchAssets()
            .then((response) => {
                // Set assets state
                setAssets(response.data)
            })
            .catch((error) => {
                // Handle error here
                setError(error.message)
                console.log(error.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }, []);

    if (loading) {
        // Render a loading animation or placeholder image while fetching assets
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="container" style={{ textAlign: 'center' }}>
                <h6>This is the landing page and should be visible independent of authentication status</h6>
                {error && (
                    <div className="alert alert-danger" role="alert" style={{ marginTop: '15px' }}>
                        {error}
                    </div>)}
                <div className="row">
                    {assets.map((asset) => (
                        <div className="col-lg-4" key={asset._id}>
                            <AssetCard
                                id={asset._id}
                                title={asset.title}
                                assetType={asset.mimeType.split('/')[0]}
                                presentationUrl={SERVER_BASE_URL + asset.presentationUrl}
                                description={asset.description}
                                uploadedBy={asset.uploadedBy}
                                pricing={asset.pricing}
                                currency={asset.pricing.currency} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LandingPage