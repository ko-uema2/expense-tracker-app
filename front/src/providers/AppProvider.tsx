import { Authenticator } from "@aws-amplify/ui-react";
import { type ReactNode, memo } from "react";
import { BrowserRouter } from "react-router-dom";

type AppProviderProps = {
	children: ReactNode;
};

export const AppProvider = memo(({ children }: AppProviderProps) => {
	return (
		<Authenticator.Provider>
			<BrowserRouter>{children}</BrowserRouter>
		</Authenticator.Provider>
	);
});
