import * as React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}

declare module 'react' {
    export = React;
}

declare module 'react-dom' {
    import * as ReactDOM from 'react-dom';
    export = ReactDOM;
}
