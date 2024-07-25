
export const getToken = () => {
    let localStore = localStorage.getItem('state')
    if (localStore){
        localStore= JSON.parse(localStore)
        return localStore.token
    }
    return null
}

export const clearLocalStorage = () => {
    localStorage.clear()

}