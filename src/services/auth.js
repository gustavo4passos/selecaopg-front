export const isAuthenticated = () => sessionStorage.getItem('@selecaopg/token') !== null

export const login = (user, token) => {
    sessionStorage.setItem('@selecaopg/token', token)
    sessionStorage.setItem('@selecaopg/user', JSON.stringify(user))
}

export const logout = () => {
    sessionStorage.removeItem('@selecaopg/token')
    sessionStorage.removeItem('@selecaopg/user')
}

export const getToken = () => sessionStorage.getItem('@selecaopg/token')

export const getUser = () => sessionStorage.getItem('@selecaopg/user')

