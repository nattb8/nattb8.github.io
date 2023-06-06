interface Window {
    callFunction(jsonData: string): void;
    initialise(): void;
    registerFunction(fx: Function): void;
    unityCallback(requestId: string, data: string): void;
    UnityPostMessage(message: string): void;
    getImxProvider(jsonData: string): void;
}