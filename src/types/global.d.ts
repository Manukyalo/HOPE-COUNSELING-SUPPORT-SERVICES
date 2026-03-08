declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
}

declare module 'react' {
    export type ReactNode = any;
    export type ReactElement = any;
    export function useState<T>(initialState: T | (() => T)): [T, (newState: T) => void];
    export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
    export function useMemo<T>(factory: () => T, deps: any[]): T;
    export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
    export function useRef<T>(initialValue: T): { current: T };
    const React: any;
    export default React;
}

declare module 'react-dom' {
    const ReactDOM: any;
    export default ReactDOM;
}

declare module 'node' {
    const node: any;
    export default node;
}

declare module 'next' {
    const next: any;
    export default next;
}

declare module 'framer-motion' {
    export const motion: any;
    export const AnimatePresence: any;
}

declare module 'next/link' {
    const Link: any;
    export default Link;
}

declare module 'next/image' {
    const Image: any;
    export default Image;
}

declare module 'next/navigation' {
    export function useRouter(): any;
    export function usePathname(): any;
    export function useSearchParams(): any;
    export function notFound(): never;
}

// Global process definition for the IDE
declare const process: {
    env: {
        [key: string]: string | undefined;
    };
};
