import { USER_ROUTE } from "../constants/common.constants"

export const getToken = () => {
    let localStore = localStorage.getItem('state')
    if (localStore){
        localStore= JSON.parse(localStore)
        return localStore.token
    }
    return null
}



export const getUserRoute = (userType) => {
    return USER_ROUTE[userType]
}

export const clearLocalStorage = () => {
    localStorage.clear()

}