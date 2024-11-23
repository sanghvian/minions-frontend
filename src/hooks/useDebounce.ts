import { useEffect } from "react"
import useTimeout from "./useTimeout"

export default function useDebounce(callback: any, delay: any, dependencies: any) {

    // Getting functions to reset (i.e. re-initialize i.e. restart) the timeout-counter that will run the callback should the timeout-interval complete
    const { reset, clear } = useTimeout(callback, delay)

    // Reinitializing our timeout-counter when dependencies change or when reset function is trigerred
    useEffect(reset, [...dependencies, reset, clear])

    // Clearing out this debounce setup if our component is unmounted
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(clear, [])
}