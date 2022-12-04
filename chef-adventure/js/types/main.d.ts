declare const scriptUrls: string[];
declare const effekseerWasmUrl: "js/libs/effekseer.wasm";
declare class Main {
    xhrSucceeded: boolean;
    loadCount: number;
    error: any;
    run(): void;
    showLoadingSpinner(): void;
    eraseLoadingSpinner(): void;
    testXhr(): void;
    hookNwjsClose(): void;
    loadMainScripts(): void;
    numScripts: number;
    onScriptLoad(): void;
    onScriptError(e: any): void;
    printError(name: any, message: any): void;
    makeErrorHtml(name: any, message: any): string;
    onWindowLoad(): void;
    onWindowError(event: any): void;
    isPathRandomized(): any;
    initEffekseerRuntime(): void;
    onEffekseerLoad(): void;
    onEffekseerError(): void;
}
declare const main: Main;
