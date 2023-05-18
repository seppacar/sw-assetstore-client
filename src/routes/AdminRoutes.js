import { Navigate, Route, Routes } from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext"

const AdminRoutes = () => {

    const { user } = useAuthContext()

    if (user && user.role === 'admin') {
        return (
            <Routes>
                <Route path="/" element={'admin home'} />
                <Route path="/dashboard" element={'admin dashboard'} />
                <Route path="*" element={"404 No route"} />
            </Routes>
        )
    }
    else {
        return (
            <Navigate to='/admin/login' />
        )
    }
}

export default AdminRoutes