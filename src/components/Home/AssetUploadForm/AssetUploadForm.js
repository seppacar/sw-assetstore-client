import { useState } from 'react';
import { uploadAsset } from '../../../services/apiService';

const AssetUploadForm = () => {
    const [assetTitle, setAssetTitle] = useState('');
    const [assetDescription, setAssetDescription] = useState('');
    const [assetFile, setAssetFile] = useState(null);
    const [assetType, setAssetType] = useState('');
    const [videoResolution, setVideoResolution] = useState('');
    const [assetTags, setAssetTags] = useState('');
    const [assetPricing, setAssetPricing] = useState({tiers:[]});

    const handleAssetChange = (event) => {
        const file = event.target.files[0];
        setAssetFile(file);

        if (file.type.includes('audio')) {
            const audioTiers = [];
            audioTiers.push({ name: 'Standard', price: 0, currency: 'USD' });
            setAssetPricing({ tiers: audioTiers });
            setAssetType('audio');
        } else if (file.type.includes('video')) {
            setAssetType('video');
            // Retrieve video dimensions
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);

            video.onloadedmetadata = () => {
                setVideoResolution(getVideoResolution(video.videoWidth, video.videoHeight));
                console.log('Video Dimensions:', video.videoWidth, video.videoHeight);
                // If asset type is video set pricing tiers accordingly to the resolution
                // TODO: This could definetly be improved I am just so tired for it now so I'll leave it now
                const videoTiers = [];
                if (video.videoWidth >= 7680 && video.videoHeight >= 4320) {
                    videoTiers.push({ name: '8K', price: 0, currency: 'USD' });
                    videoTiers.push({ name: '4K', price: 0, currency: 'USD' });
                    videoTiers.push({ name: '2K', price: 0, currency: 'USD' });
                    videoTiers.push({ name: 'FHD', price: 0, currency: 'USD' });
                    videoTiers.push({ name: 'HD', price: 0, currency: 'USD' });
                    videoTiers.push({ name: 'SD', price: 0, currency: 'USD' });
                } else if (video.videoWidth >= 3840 && video.videoHeight >= 2160) {
                    videoTiers.push({ name: '4K', price: 0, currency: 'USD' });
                    videoTiers.push({ name: '2K', price: 0, currency: 'USD' });
                    videoTiers.push({ name: 'FHD', price: 0, currency: 'USD' });
                    videoTiers.push({ name: 'HD', price: 0, currency: 'USD' });
                    videoTiers.push({ name: 'SD', price: 0, currency: 'USD' });
                } else if (video.videoWidth >= 2560 && video.videoHeight >= 1440) {
                    videoTiers.push({ name: '2K', price: 0, currency: 'USD' });
                    videoTiers.push({ name: 'FHD', price: 0, currency: 'USD' });
                    videoTiers.push({ name: 'HD', price: 0, currency: 'USD' });
                    videoTiers.push({ name: 'SD', price: 0, currency: 'USD' });
                } else if (video.videoWidth >= 1920 && video.videoHeight >= 1080) {
                    videoTiers.push({ name: 'FHD', price: 0, currency: 'USD' });
                    videoTiers.push({ name: 'HD', price: 0, currency: 'USD' });
                    videoTiers.push({ name: 'SD', price: 0, currency: 'USD' });
                } else if (video.videoWidth >= 1280 && video.videoHeight >= 720) {
                    videoTiers.push({ name: 'HD', price: 0, currency: 'USD' });
                    videoTiers.push({ name: 'SD', price: 0, currency: 'USD' });
                } else {
                    videoTiers.push({ name: 'SD', price: 0, currency: 'USD' });
                }
                setAssetPricing({ tiers: videoTiers });
            };
        } else if (file.type.includes('image')) {
            const imageTiers = [];
            imageTiers.push({ name: 'Standard', price: 0, currency: 'USD' });
            setAssetPricing({ tiers: imageTiers });
            setAssetType('audio');
            setAssetType('image');
        }
    };

    const getVideoResolution = (width, height) => {
        const resolution = width + 'x' + height;
        if (width >= 7680 && height >= 4320) {
            return resolution + ' (8K)';
        } else if (width >= 3840 && height >= 2160) {
            return resolution + ' (4K)';
        } else if (width >= 2560 && height >= 1440) {
            return resolution + ' (2K)';
        } else if (width >= 1920 && height >= 1080) {
            return resolution + ' (FHD)';
        } else if (width >= 1280 && height >= 720) {
            return resolution + ' (HD)';
        } else {
            return resolution + ' (SD)';
        }
    };

    const handlePriceChange = (tierName, newValue) => {
        setAssetPricing(prevTiers => ({
            ...prevTiers,
            tiers: prevTiers.tiers.map(tier => {
              if (tier.name === tierName) {
                return {
                  ...tier,
                  price: newValue
                };
              }
              return tier;
            })
          }));
      };

    const handleSubmit = (event) => {
        event.preventDefault();
        let formData = new FormData();
        formData.append('file', assetFile);
        formData.append('title', assetTitle);
        formData.append('description', assetDescription);
        formData.append('tags', assetTags);
        formData.append('pricing', JSON.stringify(assetPricing));

        uploadAsset(formData)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='container'>
                <div className='row'>
                    <div className='col-lg-4'>
                        {/* Asset Preview */}
                        {assetFile && assetType === 'image' && (
                            <div className='image'>
                                <h3>Selected Image Preview:</h3>
                                <img src={URL.createObjectURL(assetFile)} alt='Selected' style={{ maxWidth: '100%' }} />
                            </div>
                        )}
                        {assetFile && assetType === 'video' && (
                            <div className='video'>
                                <h3>Selected Video Preview:</h3>
                                <video src={URL.createObjectURL(assetFile)} controls style={{ maxWidth: '100%' }} />
                                {videoResolution && <p>Resolution: {videoResolution}</p>}
                            </div>
                        )}
                        {/* Asset File Input */}
                        <input
                            className='form-control'
                            type='file'
                            id='formFile'
                            onChange={handleAssetChange}
                            accept='image/*, video/*, audio/*'
                        />
                    </div>
                    <div className='col-lg-8'>
                        {/* Asset Details */}
                        <div>
                            <div className='form-floating mb-3'>
                                <input
                                    type='text'
                                    className='form-control'
                                    id='floatingInput'
                                    placeholder='Title of the asset'
                                    value={assetTitle}
                                    onChange={(e) => setAssetTitle(e.target.value)}
                                />
                                <label htmlFor='floatingInput'>Title</label>
                            </div>
                            <div className='form-floating mb-3'>
                                <input
                                    type='text'
                                    className='form-control'
                                    id='floatingInput'
                                    placeholder='Description of the asset'
                                    value={assetDescription}
                                    onChange={(e) => setAssetDescription(e.target.value)}
                                />
                                <label htmlFor='floatingInput'>Description</label>
                            </div>
                            <div className='form-floating mb-3'>
                                <input
                                    type='text'
                                    className='form-control'
                                    id='floatingInput'
                                    placeholder='Title of the asset'
                                    value={assetTags}
                                    onChange={(e) => setAssetTags(e.target.value)}
                                />
                                <label htmlFor='floatingInput'>
                                    Tag (will change in production to have multiple tags)
                                </label>
                            </div>
                            {/* Pricing */}
                            <div>
                                <h3>Pricing</h3>
                                {assetPricing.tiers.map((tier, index) => (
                                    <div key={index} className='form-floating mb-3'>
                                        <input
                                            type='number'
                                            className='form-control'
                                            id='floatingInput'
                                            placeholder={`${tier.name} Price`}
                                            value={tier.price}
                                            onChange={e => handlePriceChange(tier.name, e.target.value)}
                                        />
                                        <label htmlFor='floatingInput'>{`${tier.name} Price`}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div></div>
            <button className='btn btn-sm btn-warning' type='submit'>
                Upload Asset
            </button>
        </form>
    );
};

export default AssetUploadForm;
