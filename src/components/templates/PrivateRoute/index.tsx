import React from "react"
// import { Route, Redirect } from "react-router-dom"
// import { useAuth } from "../../../contexts/AuthContext"

export default function PrivateRoute({ component: Component, ...rest }: any) {
    // const { currentUser } = useAuth()

    return (
        <div></div>
        // <Route
        //     {...rest}
        //     render={(props: any) => {
        //         return currentUser ? <Component {...props} /> : <Redirect to="/login" />
        //     }}
        // ></Route>
    )
}