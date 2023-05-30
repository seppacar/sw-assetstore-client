import { Route, Routes } from "react-router-dom"
import LandingPage from "../pages/Home/LandingPage"
import LoginPage from "../pages/Home/LoginPage"
import SignupPage from "../pages/Home/SignupPage"
import UploadAssetPage from "../pages/Home/UploadAssetPage"
import DemoPaymentPage from "../pages/Home/DemoPaymentPage"
import UserDashboardPage from "../pages/Home/UserDashboardPage"
import Cart from "../pages/Home/Cart"
import PaymentPage from "../pages/Home/PaymentPage"

const HomeRoutes = () => {
    
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/upload-asset" element={<UploadAssetPage />} />
            <Route path="/demo-payment" element={<DemoPaymentPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={"404 No route"} />
        </Routes>
    )
}

export default HomeRoutes