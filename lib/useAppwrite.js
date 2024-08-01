import { Alert } from "react-native";
import { useState, useEffect } from "react"

const useAppwrite = ({fn}) => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchData = async () => {
        setIsLoading(true)

        try {
            if (typeof fn !== 'function') {
                throw new Error("fn must be a function");
            }
            const response = await fn()
            setData(response)
        } catch (error) {
            const appwriteError = error
            console.log("Appwrite service :: RefreshExpenses() :: " + Error(appwriteError.message));    
            } finally{
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const refetch = () => fetchData();

    return { data, isLoading, refetch }
};

export default useAppwrite;