// import { useContext, useState, useEffect, createContext } from "react"
// import { auth } from "../legacy/utils/firebase"
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"

// const AuthContext = createContext<any>(null)

// export function useAuth() {
//     return useContext(AuthContext)
// }

// export function AuthProvider({ children }: any) {
//     const [currentUser, setCurrentUser] = useState<any>()
//     const [loading, setLoading] = useState(true)

//     function signup(email: string, password: string) {
//         return (auth as any).createUserWithEmailAndPassword(email, password)
//     }

//     function login(email: string, password: string) {
//         return (auth as any).signInWithEmailAndPassword(email, password)
//     }

//     function loginWithPopup() {
//         const provider = new GoogleAuthProvider();
//         return signInWithPopup(auth, provider)
//     }

//     function logout() {
//         return (auth as any).signOut()
//     }

//     function resetPassword(email: string) {
//         return (auth as any).sendPasswordResetEmail(email)
//     }

//     function updateEmail(email: string) {
//         return currentUser.updateEmail(email)
//     }

//     function updatePassword(password: string) {
//         return currentUser.updatePassword(password)
//     }

//     useEffect(() => {
//         const unsubscribe = auth.onAuthStateChanged((user: any) => {
//             setCurrentUser(user)
//             setLoading(false)
//         })

//         return unsubscribe
//     }, [])

//     const value = {
//         currentUser,
//         login,
//         signup,
//         logout,
//         resetPassword,
//         updateEmail,
//         updatePassword,
//         loginWithPopup
//     }
//     return (
//         <AuthContext.Provider value={value}>
//             {!loading && children}
//         </AuthContext.Provider>
//     )
// }
export { }