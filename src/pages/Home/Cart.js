
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useCartContext } from "../../hooks/useCartContext"
import { useAuthContext } from "../../hooks/useAuthContext";

import { fetchAssetPresentation, createOrder } from "../../services/apiService"

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL

const Cart = () => {
    const { user } = useAuthContext()
    const { cartItems, removeFromCart } = useCartContext()
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const [orderData, setOrderData] = useState(null)
    const [creatingOrder, setCreatingOrder] = useState(false);
    const [cartItemPresentations, setCartItemPresentations] = useState([]);


    useEffect(() => {
        const fetchAssetPresentations = () => {
            Promise.all(
                cartItems.map((item) => fetchAssetPresentation(item))
            ).then((responses) => {
                const assetPresentations = responses.map((response) => response.data);
                setCartItemPresentations(assetPresentations);
                // Initalize temporary orderData
                // Initialize orderData
                const initialOrderData = assetPresentations.map((cartItem) => {
                    const { id, pricing } = cartItem.presentation;
                    const firstTier = pricing.tiers[0].name;
                    return { itemId: id, tier: firstTier };
                });
                setOrderData(initialOrderData);
            }).catch((error) => {
                setError(error);
            }).finally(() => {
                setLoading(false);
            })
        };

        fetchAssetPresentations();
    }, [cartItems]);

    const handleTierChange = (itemId, selectedTier) => {
        setOrderData((prevOrderData) =>
            prevOrderData.map((item) =>
                item.itemId === itemId ? { ...item, tier: selectedTier } : item
            )
        );
    };

    const handleProceedToCheckout = async () => {
        if (!user) {
            setError("Must authenticate")
            navigate(`/login`);
            return null
        }
        setCreatingOrder(true);
        let orderId
        await createOrder(orderData)
            .then((response) => {
                orderId = response.data._id
                setError(null)
                // Remove items from cart on success
                cartItems.forEach((cartItem) => {
                    removeFromCart(cartItem);
                });
            })
            .catch((error) => {
                setError(error.response.data.error)
                console.log(error.response.data.error)
            })
            .finally(() => {
                navigate(`/payment?orderId=${orderId}`);

                setCreatingOrder(false)
            })
    }

    return (
        <div style={{ textAlign: 'center' }}>
            {loading && (
                <div>
                    <h6>Loading!!!</h6>
                </div>
            )}
            {!loading && (
                <div>
                    <h6>This is cart and should be seen by logged in or not logged in but in order to proceed must logged in</h6>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-7" style={{ border: '1px solid red' }}>
                                <div className="card">
                                    <div className="card-header"><h6>Cart Items</h6></div>
                                    <ul className="list-group list-group-flush">
                                        {
                                            cartItemPresentations.map((cartItem) => (
                                                <li className="list-group-item" key={cartItem.presentation.id}>
                                                    <div className="row align-items-center">
                                                        <div className="col-lg-4">
                                                            <img style={{ width: '100%', height: '100%' }} src={SERVER_BASE_URL + cartItem.presentation.presentationUrl} alt={cartItem.presentation.title}></img>
                                                            <p>if we add pricing based on resolution</p>
                                                            <select
                                                                className="form-select"
                                                                aria-label="Default select example"
                                                                defaultValue={cartItem.presentation.pricing.tiers[0].name}
                                                                onChange={(e) => handleTierChange(cartItem.presentation.id, e.target.value)}
                                                            >
                                                                {cartItem.presentation.pricing.tiers.map((tier) => (
                                                                    <option key={tier.name} value={tier.name}>{tier.name} {tier.price} {tier.currency}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="col-lg-3">
                                                            <span><b>{cartItem.presentation.title}</b></span>
                                                            <br />
                                                            <span>{cartItem.presentation.description}</span>
                                                        </div>
                                                        <div className="col-lg-4">
                                                            <span>
                                                                <b>Price: </b>{" "}
                                                                {orderData.find((item) => item.itemId === cartItem.presentation.id)?.tier}{" "}
                                                                {cartItem.presentation.pricing.tiers.find(
                                                                    (tier) => tier.name === orderData.find((item) => item.itemId === cartItem.presentation.id)?.tier
                                                                )?.price}{" "}
                                                                {cartItem.presentation.pricing.tiers.find(
                                                                    (tier) => tier.name === orderData.find((item) => item.itemId === cartItem.presentation.id)?.tier
                                                                )?.currency}
                                                            </span>                                                        </div>
                                                        <div className="col-lg-1"><button className="btn btn-sm btn-danger" onClick={() => {
                                                            removeFromCart(cartItem.presentation.id)
                                                        }}>X</button></div>
                                                    </div>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-5" style={{ border: '1px solid green' }}>
                                <div className="card">
                                    <div className="card-header"><h6>Cart Info?</h6></div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
                                            <b>Total:</b>{" "}
                                            {cartItemPresentations.reduce((totalPrice, currentItem) => {
                                                const selectedTier = orderData.find((item) => item.itemId === currentItem.presentation.id)?.tier;
                                                const price = currentItem.presentation.pricing.tiers.find((tier) => tier.name === selectedTier)?.price;
                                                return totalPrice + (price || 0);
                                            }, 0)} USD
                                        </li>
                                        <li className="list-group-item">
                                            <button type="button" className="btn btn-outline-success" onClick={handleProceedToCheckout} disabled={creatingOrder}>{creatingOrder ? "Creating Order..." : "Proceed to Checkout"}</button>
                                        </li>
                                        {error && (
                                            <div className="alert alert-danger" role="alert" style={{ marginTop: '15px' }}>
                                                {error}
                                            </div>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }

        </div>
    )
}

export default Cart