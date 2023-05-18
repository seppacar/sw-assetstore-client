import React, { useState } from 'react';
import { uploadAsset } from '../../../services/apiService';

const AssetUploadForm = () => {

    const [assetTitle, setAssetTitle] = useState('');
    const [assetDescription, setAssetDescription] = useState('');
    const [assetFile, setAssetFile] = useState(null);
    const [assetTags, setAssetTags] = useState('');
    const [assetPrice, setAssetPrice] = useState('');

    const handleAssetChange = (event) => {
        const file = event.target.files[0];
        setAssetFile(file);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let formData = new FormData()
        console.log(event.target)
        formData.append('file', assetFile)
        formData.append('title', assetTitle)
        formData.append('description', assetDescription)
        formData.append('tags', assetTags)
        formData.append('price', assetPrice)


        uploadAsset(formData)
            .then((response) => {
                console.log(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(
        )
        // Handle form submission logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='container'>
                <div className='row'>
                    <div className='col-lg-4'>
                        {assetFile && (
                            <div className='image'>
                                <h3>Selected Image Preview:</h3>
                                <img src={URL.createObjectURL(assetFile)} alt="Selected" style={{ maxWidth: '100%' }} />
                            </div>
                        )}
                        <input class="form-control" type="file" id="formFile" onChange={handleAssetChange} accept="image/*" />
                    </div>
                    <div className='col-lg-8'>
                        <div>
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="floatingInput" placeholder="Title of the asset"
                                    value={assetTitle}
                                    onChange={(e) => setAssetTitle(e.target.value)}
                                />
                                <label for="floatingInput">Title</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="floatingInput" placeholder="Description of the asset"
                                    value={assetDescription}
                                    onChange={(e) => setAssetDescription(e.target.value)}
                                />
                                <label for="floatingInput">Description</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="floatingInput" placeholder="Title of the asset"
                                    value={assetTags}
                                    onChange={(e) => setAssetTags(e.target.value)}
                                />
                                <label for="floatingInput">Tag (will change in production to have multiple tags)</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" class="form-control" id="floatingInput" placeholder="Title of the asset"
                                    value={assetPrice}
                                    onChange={(e) => setAssetPrice(e.target.value)}
                                />
                                <label for="floatingInput">Price</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>

            </div>
            {assetFile && (
                <div className='container'>
                    <div className='row'></div>

                </div>
            )}
            <button className="btn btn-sm btn-warning" type="submit">Upload Asset</button>
        </form>
    )
}

export default AssetUploadForm