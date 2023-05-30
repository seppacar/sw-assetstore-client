
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'

import { fetchOrder } from '../../services/apiService';
import WalletPayment from '../../components/Home/WalletPayment/WalletPayment';

const PaymentPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('orderId');
    const [paymentMethod, setPaymentMethod] = useState('creditcard');
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true)
        fetchOrder(orderId)
            .then((response) => {
                setOrderDetails(response.data)
            })
            .catch((error) => {
                console.log(error.response.data.error)
                setError(error.response.data.error)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [orderId]);
    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };
    if (loading || error) {
        return (
            <div>
                Loading
            </div>
        )
    }
    return (
        <div style={{ textAlign: 'center' }}>
            <h6>This is the payment page only should be seen by correct order id and if the creator of the order is same with user</h6>
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <b>Order id: </b>{orderId}
                    </div>
                    <div className="col-lg-4">
                        <b>Order Details:</b>
                        <br />
                        <b>Total:</b>{orderDetails.amount.USD} USD
                    </div>
                    {error}
                </div>
                <div className='row'>
                    <div className='col-lg-12'>
                        <label className="me-2">
                            <input
                                type="radio"
                                value="creditcard"
                                checked={paymentMethod === 'creditcard'}
                                onChange={handlePaymentMethodChange}
                                className="form-check-input me-2"
                            />
                            Credit Card
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="cryptocurrency"
                                checked={paymentMethod === 'cryptocurrency'}
                                onChange={handlePaymentMethodChange}
                                className="form-check-input me-2"
                            />
                            Cryptocurrency
                        </label>
                    </div>
                    <div className='col-lg-12'>

                        {paymentMethod === 'creditcard' ? (
                            <form onSubmit={() => { console.log("creditcard submit") }}>
                                {/* Credit card payment form fields */}
                                <div className="mb-3">
                                    <input type="text" name="cardNumber" placeholder="Card Number" required className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <input type="text" name="expiry" placeholder="Expiry" required className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <input type="text" name="cvv" placeholder="CVV" required className="form-control" />
                                </div>
                                <button type="submit" className="btn btn-primary">Pay with Credit Card</button>
                            </form>
                        ) : (
                            <div>
                                <WalletPayment orderDetails={orderDetails} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentPage