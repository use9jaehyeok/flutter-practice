declare global {
    interface Window {
        flutter_inappwebview?: {
            callHandler: (handlerName: string, ...args: unknown[]) => void;
        }
        onNativeImageSelected?: (base64: string) => void;
    }
}

export {}