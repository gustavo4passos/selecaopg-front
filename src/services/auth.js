export const isAuthenticated = () => token !== undefined

let token = undefined
let user = undefined

export const getToken = () => token

export const setToken = (tk) => {
    token = tk
}

export const getUser = () => user

export const setUser = (user) => {
    user = user
}
