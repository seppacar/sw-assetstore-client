import HoverVideoPlayer from 'react-hover-video-player';
import { useCartContext } from '../../../hooks/useCartContext';


const AssetCard = ({ id, title, description, presentationUrl, price, currency, uploadedBy, assetType }) => {
    const { cartItems, addToCart, removeFromCart } = useCartContext()

    return (
        <div className="card" style={{ margin: '30px 0 0 0' }}>
            {assetType === 'video' ?
                (<HoverVideoPlayer
                    videoSrc={presentationUrl}
                    pausedOverlay={(<div style={{
                        height: '100%',
                        background: 'red',
                        opacity: '0.2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        taetea
                    </div>)}
                />) :
                (<img src={presentationUrl} className="card-img-top" alt="desc" />)}

            <div className="card-body">
                <h6>{title}</h6>
                <p className="card-text">{description}</p>
                <button className="btn btn-sm btn-success">Buy now</button>
                {cartItems.includes(id) ?
                    (<button className="btn btn-sm btn-danger" onClick={() => {
                        removeFromCart(id)
                    }}>Remove from cart</button>) : (<button className="btn btn-sm btn-success" onClick={() => {
                        addToCart(id)
                    }}>Add to cart</button>)}

                <p>Uploaded By: {uploadedBy.userId} : {uploadedBy.username}</p>
                <b>Price: </b>{price} {currency}
            </div>
        </div>
    )
}

export default AssetCard