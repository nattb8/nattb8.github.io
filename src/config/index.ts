export const scope = "openid offline_access profile email transact"
export const audience = "platform_api"

const env = process.env.NODE_ENV
let redirectUri: string
let logoutRedirectUri: string
// if (env == "development") {
    // redirectUri = "http://localhost:3000/"
    // logoutRedirectUri = "http://localhost:3000/callback"
// } else if (env == "production") {
    redirectUri = "https://nattb8.github.io/"
    logoutRedirectUri = "https://nattb8.github.io/callback"
// }
export { redirectUri, logoutRedirectUri }
