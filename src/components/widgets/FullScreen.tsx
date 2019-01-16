import React from 'react';

export function FullScreen(props: {children: JSX.Element}) {
    return <div style={{ height: '100vh' }}>{props.children}</div>;
}