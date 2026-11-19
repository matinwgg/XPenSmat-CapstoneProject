import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Run an async Appwrite query and expose its result.
 *
 * Accepts either a function (`useAppwrite(() => query())`) or an options
 * object (`useAppwrite({ fn: () => query() })`) because both call styles are
 * present in the application.
 */
const useAppwrite = (fnOrOptions) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const mountedRef = useRef(true);

    const fn = typeof fnOrOptions === "function"
        ? fnOrOptions
        : fnOrOptions && typeof fnOrOptions.fn === "function"
            ? fnOrOptions.fn
            : null;

    const fetchData = useCallback(async () => {
        setIsLoading(true);

        try {
            if (typeof fn !== "function") {
                throw new Error("fn must be a function");
            }
            const response = await fn();
            if (mountedRef.current) {
                setData(response === undefined ? [] : response);
            }
            return response;
        } catch (error) {
            console.log("Appwrite service :: RefreshExpenses() ::", error);
            if (mountedRef.current) {
                setData([]);
            }
            return undefined;
        } finally {
            if (mountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [fn]);

    useEffect(() => {
        mountedRef.current = true;
        fetchData();
        return () => {
            mountedRef.current = false;
        };
        // Intentionally fetch once on mount, matching the original behaviour.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { data, isLoading, refetch: fetchData };
};

export default useAppwrite;
