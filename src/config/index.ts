export const scope = "openid offline_access profile email transact"
export const audience = "platform_api"

const env = process.env.NODE_ENV
let redirectUri: string
let logoutRedirectUri: string
if (env == "development") {
    redirectUri = "http://192.168.1.63:3000/"
    logoutRedirectUri = "http://192.168.1.63:3000/"
} else if (env == "production") {
    redirectUri = "https://nattb8.github.io/"
    logoutRedirectUri = "https://nattb8.github.io/callback"
}
export { redirectUri, logoutRedirectUri }
