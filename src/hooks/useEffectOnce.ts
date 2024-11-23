import { useEffect } from "react"

export default function useEffectOnce(cb: any) {
    // We pass to dependencies to useEffect so we force it to run only when the component is mounted and not each time component is re-rendered because its state was updated
    // eslint-disable-next-line
    useEffect(cb, [])
}