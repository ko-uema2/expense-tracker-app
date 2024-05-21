import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook for handling authentication.
 * Returns an object with the `isAuthenticated` property.
 */
export const useAuth = () => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const nav = useNavigate();
  const isAuthenticated = authStatus === "authenticated";

  useEffect(() => {
    /**
     * Checks if the authentication token has expired.
     * If the token has expired, navigates to the sign-in page.
     * If an error occurs, logs the error and navigates to the sign-in page.
     */
    const checkTokenExpiration = async () => {
      try {
        /// Get the current session.
        const session = await fetchAuthSession();

        const expTime = session.tokens?.idToken?.payload.exp;
        const currentTime = Math.floor(Date.now() / 1000);

        if (expTime && currentTime > expTime) {
          signOut();
          nav("/auth/signin");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error);
          signOut();
          nav("/auth/signin");
        } else {
          console.error("An error occurred. Please try again.", error);
          signOut();
          nav("/auth/signin");
        }
      }
    };

    if (isAuthenticated) {
      checkTokenExpiration();
    }
  }, [isAuthenticated, nav]);

  return { isAuthenticated };
};
