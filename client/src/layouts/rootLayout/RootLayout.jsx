import './rootLayout.css'
import {Link, Outlet} from 'react-router-dom'
import { ClerkProvider, SignedIn, UserButton } from "@clerk/clerk-react";
//https://tanstack.com/query/latest/docs/framework/react/quick-start
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

// clerk for login
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}

// Create a client
const queryClient = new QueryClient()

const RootLayout = () => {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
            {/* Provide the client to your App */}
            <QueryClientProvider client={queryClient}>
                <div className="rootLayout">
                    <header>
                        <Link to="/" className="logo">
                            <img src="/logo.png" alt="" />
                            <span>CHAT AI</span>
                        </Link>
                        <div className="user">
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </header>
                    <main>
                        <Outlet />
                    </main>
                </div>
            </QueryClientProvider>
        </ClerkProvider>
    );
};

export default RootLayout;