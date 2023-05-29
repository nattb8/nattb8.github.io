interface Window {
    callFunction(): void;
    initialise(): void;
    registerFunction(fx: Function): void;
    login(): void;
    logout(): void;
    getAccessToken(): void;
    getAddress(requestId: string): void;
    unityCallback(requestId: string, data: string): void;
    UnityPostMessage(message: string): void;
}