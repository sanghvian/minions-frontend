import { useEffect, useState } from "react"
import { useMediaQuery } from "react-responsive"
import useEventListener from "./useEventListener"

export const useDimensions = () => {
    const isDesktopOrLaptop = useMediaQuery({
        maxWidth: 700
    })
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    })
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isMobile = useMediaQuery({ maxWidth: 700 })
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
    const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })


    useEffect(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        })
    }, [])
    useEventListener("resize", () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    })

    return {
        isDesktopOrLaptop,
        isBigScreen,
        isMobile,
        isPortrait,
        isRetina,
        windowSize
    }
}