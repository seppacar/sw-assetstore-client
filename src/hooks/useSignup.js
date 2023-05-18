import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

import { authSignup } from "../services/apiService";


export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { login } = useAuthContext()

    const signupUser = async (signupDetails) => {
        setIsLoading(true)
        setError(null)

        await authSignup(signupDetails)
            .then((response) => {
                // Handle success here
                // Login with new created account
                login(response.data.token)
                console.log(response.data)
            })
            .catch((error) => {
                // Handle error
                setError(error.response.data.error)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    return { signupUser, isLoading, error }
}