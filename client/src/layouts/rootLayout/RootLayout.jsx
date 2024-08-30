import './rootLayout.css'
import {Link, Outlet} from 'react-router-dom'
import { ClerkProvider, SignedIn, UserButton } from "@clerk/clerk-react";

// clerk for login
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}

const RootLayout = () => {
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">

        <div className="rootLayout">
            <header>
                {/* 로고와 애플리케이션 이름을 클릭할 수 있도록 링크로 설정 */}
                <Link to="/" className="logo">
                    <img src="/logo.png" alt="logo"/>
                    <span>Chat AI</span>
                </Link>
                <div className="user">
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </header>
            <main>
                {/* main,jsx children parts ( 자식 라우트의 내용을 렌더링하는 Outlet) */}
                <Outlet/>
            </main>
        </div>
        </ClerkProvider>
    );
};

export default RootLayout;