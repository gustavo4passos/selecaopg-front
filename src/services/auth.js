export const isAuthenticated = () => token !== null

let token = sessionStorage.getItem('@selecaopg/token')
let user = sessionStorage.getItem('@selecaopg/user')

export const getToken = () => token

export const setToken = (tk) => {
    token = tk
    sessionStorage.setItem('@selecaopg/token', token)
}

export const getUser = () => JSON.parse(user)

export const setUser = (newUser) => {
    user = newUser
    sessionStorage.setItem('@selecaopg/user', JSON.stringify(user))
}
