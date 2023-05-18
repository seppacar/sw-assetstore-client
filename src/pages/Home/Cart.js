
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useCartContext } from "../../hooks/useCartContext"
import { useAuthContext } from "../../hooks/useAuthContext";

import { fetchAssetPresentation, createOrder } from "../../services/apiService"

const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL

const Cart = () => {
    const { user, loading: authLoading } = useAuthContext()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const [creatingOrder, setCreatingOrder] = useState(false);
    const { cartItems, addToCart, removeFromCart } = useCartContext()
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("creditCard"); // Default selected payment method
    const [cartItemPresentations, setCartItemPresentations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssetPresentations = () => {
            Promise.all(
                cartItems.map((item) => fetchAssetPresentation(item))
            ).then((responses) => {
                const assetPresentations = responses.map((response) => response.data);
                setCartItemPresentations(assetPresentations);
            }).catch((error) => {
                setError(error);
            }).finally(() => {
                setLoading(false);
            })
        };

        fetchAssetPresentations();
    }, [cartItems]);

    const handlePaymentMethodChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const handleProceedToCheckout = async () => {
        if(!user){
            setError("Must authenticate")
            navigate(`/login`);
            return null
        }
        setCreatingOrder(true);
        const orderData = {}
        orderData.items = cartItems
        orderData.paymentMethod = selectedPaymentMethod
        let orderId
        await createOrder(orderData)
            .then((response) => {
                orderId = response.data
                setError(null)
                // Remove items from cart on success
                cartItems.forEach((cartItem) => {
                    removeFromCart(cartItem);
                  });
                console.log(orderId)
            })
            .catch((error) => {
                setError(error.response.data.error)
                console.log(error.response.data.error)
            })
            .finally(() => {
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
                                                <li className="list-group-item">
                                                    <div className="row align-items-center">
                                                        <div className="col-lg-3">
                                                            <img style={{ width: '100%', height: '100%' }} src={SERVER_BASE_URL + cartItem.presentation.presentationUrl}></img>
                                                            <p>if we add pricing based on resolution</p>
                                                            <select className="form-select" aria-label="Default select example">
                                                                <option selected>Resolution</option>
                                                                <option value="1">4K</option>
                                                                <option value="2">HD</option>
                                                                <option value="3">SD</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-lg-4">
                                                            <span><b>{cartItem.presentation.title}</b></span>
                                                            <br />
                                                            <span>{cartItem.presentation.description}</span>
                                                        </div>
                                                        <div className="col-lg-4">
                                                            <span><b>Price: </b> {cartItem.presentation.pricing.price} {cartItem.presentation.pricing.currency}</span>
                                                        </div>
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
                                            <b>Total:</b> {cartItemPresentations.reduce((totalPrice, currentItem) => {
                                                return totalPrice + currentItem.presentation.pricing.price
                                            }, 0)} USD
                                        </li>
                                        <li className="list-group-item" style={{ background: 'cyan' }}>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="test" onChange={handlePaymentMethodChange} checked={selectedPaymentMethod === "test"} />
                                                <label className="form-check-label" for="flexRadioDefault2">
                                                    Test
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="cryptoCurrency" onChange={handlePaymentMethodChange} checked={selectedPaymentMethod === "cryptoCurrency"} />
                                                <label className="form-check-label" for="flexRadioDefault1">
                                                    Metamask Wallet
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="creditCard" onChange={handlePaymentMethodChange} checked={selectedPaymentMethod === "creditCard"} />
                                                <label className="form-check-label" for="flexRadioDefault2">
                                                    Credit Card
                                                </label>
                                            </div>
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