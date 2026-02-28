import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from 'react'
import { ClerkProvider } from '@clerk/clerk-react'
import App from "./App";
import "./index.css";


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </ClerkProvider>
  </  StrictMode>
);