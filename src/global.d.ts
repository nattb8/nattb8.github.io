interface Window {
    callFunction(jsonData: string): void;
    initialise(): void;
    registerFunction(fx: Function): void;
    connect(): void;
    logout(): void;
    getAccessToken(): void;
    getAddress(requestId: string): void;
    unityCallback(requestId: string, data: string): void;
    UnityPostMessage(message: string): void;
}