const { REACT_APP_LOCAL_STORAGE_KEY } = process.env

export const getTokenFromLocal = () => {
    let localStore = localStorage.getItem(REACT_APP_LOCAL_STORAGE_KEY)
    if (localStore) {
        localStore = JSON.parse(localStore)
        return localStore.token
    }
    return null
}
export const setTokenToLocal = (token) => {
    localStorage.setItem(REACT_APP_LOCAL_STORAGE_KEY, JSON.stringify({ token }))
}

export const clearLocalStorage = () => {
    localStorage.clear()
}