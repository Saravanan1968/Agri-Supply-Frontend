import { createContext, useEffect, useState } from "react";

export const Dcontext = createContext()


function DataContext(props) {

    const [currentUser, setCurrentUser] = useState(null)
    const [isAuth, setIsAuth] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isManufacturer, setIsManufacturer] = useState(false)
    const [isReceiver, setIsReceiver] = useState(false)
    const [isDriver, setIsDriver] = useState(false)

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/check-auth`, {
            method: 'GET',
            credentials: 'include' // Important for sending cookies
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setIsAuth(true)
                    // The backend returns it capitalized as `User`
                    const authedUser = data.User || data.user;
                    setCurrentUser(authedUser)

                    // Role based access
                    if (authedUser && authedUser.role === 'admin') {
                        setIsAdmin(true)
                    }
                    else if (authedUser && authedUser.role === 'manufacturer') {
                        setIsManufacturer(true)
                    }
                    else if (authedUser && authedUser.role === 'receiver') {
                        setIsReceiver(true)
                    }
                    else if (authedUser && authedUser.role === 'driver') {
                        setIsDriver(true)
                    }
                } else {
                    // Not authenticated
                    setIsAuth(false)
                    setCurrentUser(null)
                    setIsAdmin(false)
                    setIsManufacturer(false)
                    setIsReceiver(false)
                    setIsDriver(false)
                }
                setIsLoading(false)
            })
            .catch(err => {
                console.error("Auth check failed:", err)
                setIsAuth(false)
                setCurrentUser(null)
                setIsLoading(false)
            })
    }, [])


    const data = { currentUser, isAuth, isLoading, isAdmin, isManufacturer, isReceiver, isDriver }

    return (
        <Dcontext.Provider value={data}>
            {props.children}
        </Dcontext.Provider>
    )
}

export default DataContext