import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import styles from "./Header.module.css"; // optional CSS module for custom styles

export default function Header(): JSX.Element {
  const { user, isLoaded } = useUser();

  const isAdmin =
    user?.publicMetadata?.role === "admin" ||
    user?.publicMetadata?.isAdmin === true ||
    user?.publicMetadata?.isAdmin === "true";

  return (
    <header className={styles.header}>
      <h2 className={styles.title}>🗳️ Balele Precinct Search System</h2>

      <nav className={styles.navLinks}>
        <Link to="/" className={styles.navLink}>Home</Link>
        <Link to="/news" className={styles.navLink}>News</Link>

        {/* Show Admin link only if signed in AND admin */}
        <SignedIn>
          {isLoaded && isAdmin && (
            <Link to="/admin" className={styles.adminLink}>
              Admin Dashboard
            </Link>
          )}
        </SignedIn>

        {/* Authentication Buttons */}
        <SignedOut>
          <SignInButton mode="modal">
            <span className={styles.authLink}>Sign In</span>
          </SignInButton>{" "}
          <SignUpButton mode="modal">
            <span className={styles.authLink}>Sign Up</span>
          </SignUpButton>
        </SignedOut>

        {/* User Profile Button */}
        <SignedIn>
          {isLoaded && user && (
            <div className={styles.userProfile}>
              <span className={styles.userName}>
                Hi, {user.firstName || "User"}
              </span>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonBox: styles.userButtonBox,
                  },
                }}
              />
            </div>
          )}
        </SignedIn>
      </nav>
    </header>
  );
}