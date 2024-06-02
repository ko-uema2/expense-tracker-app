import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";

/**
 * Custom hook for handling authentication.
 * Returns an object with the `isAuthenticated` property.
 */
export const useAuthToken = () => {
  const [isValid, setIsValid] = useState<{
    isValid: boolean;
    error: Error | null;
  }>({ isValid: false, error: null });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    /**
     * Checks if the authentication token has expired.
     * If the token has expired, navigates to the sign-in page.
     * If an error occurs, logs the error and navigates to the sign-in page.
     */
    const checkTokenExpiration = async () => {
      setLoading(true);

      try {
        // Get the current session.
        // TODO: ブラウザにトークンが保存されていない場合に fetchAuthSession がどのような挙動をするか確認が必要
        const session = await fetchAuthSession();

        const expTime = session.tokens?.idToken?.payload.exp;
        const currentTime = Math.floor(Date.now() / 1000);

        if (expTime && currentTime > expTime) {
          setIsValid({ isValid: false, error: null });
        } else {
          setIsValid({ isValid: true, error: null });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error);
          setIsValid({ isValid: false, error });
        } else {
          console.error("An error occurred. Please try again.", error);
          setIsValid({
            isValid: false,
            error: new Error("An error occurred. Please try again."),
          });
        }
      } finally {
        setLoading(false);
      }
    };

    checkTokenExpiration();
  }, []);

  return { loading, ...isValid };
};
