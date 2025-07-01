import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router-dom';
import type { LinksFunction } from 'react-router';
import { Toaster } from '../components/ui/sonner';
import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import '../index.css';

export const links: LinksFunction = () => [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
    },
    {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
    },
];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <Toaster />
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function Root() {
    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.initDataStructure();
        }
    }, []);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="h-screen w-screen bg-transparent">
                <Outlet />
            </div>
        </DndProvider>
    );
}
