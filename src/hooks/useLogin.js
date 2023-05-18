import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

import { authLogin } from "../services/apiService";

export const useLogin = () => {
    const { login } = useAuthContext()

    const [isLoading, setIsLoading] = useState(null)
    const [error, setError] = useState(null);

    const loginUser = async (loginCredentials) => {
        setIsLoading(true)
        setError(null)
        await authLogin(loginCredentials)
            .then((response) => {
                // send token to AuthContext
                login(response.data.token)
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

    return { loginUser, isLoading, error }
}