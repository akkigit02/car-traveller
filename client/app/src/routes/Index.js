import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getToken } from '../services/Authentication.service';
import Protected from './Protected';
import Authetication from './Authetication';

function Index() {
    const [isLoading, setIsLoading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [session, setSession] = useState({})
    const getSession = async () => {
        try {
            const token = getToken()
            if (!token) {
                setIsAuthenticated(false)
            } else {
                const { data } = await axios({
                    url: '/api/auth/session',
                    method: 'GET',
                    params: {
                        token
                    }
                })
                setIsAuthenticated(true)
                setSession(data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getSession()
    })

    return (
        <>
            {
                isLoading ? <div>Loading</div> : <>{
                    isAuthenticated ? <Protected></Protected> : <Authetication>
                    </Authetication>}
                </>
            }
        </>
    )
}

export default Index