import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

import { authLogout } from "../services/apiService";

export const useLogout = () => {
    const { logout } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(null)
    const [error, setError] = useState(null);

    const logoutUser = async () => {
        setIsLoading(true)
        setError(null)
        await authLogout()
            .then((response) => {
                console.log(response)
                // send token to AuthContext
                logout(response.data.token)
            })
            .catch((error) => {
                // Handle fail
                setError(error.response.data.error)
            })
            .finally(() => {
                // Finally remove loading state
                setIsLoading(false)
            })
    }

    return { logoutUser, isLoading, error }
}