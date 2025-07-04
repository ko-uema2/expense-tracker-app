import { AppProvider } from "@/providers/AppProvider";
import { AppRouter } from "@/routes/AppRouter";
import { Amplify } from "aws-amplify";

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolId: import.meta.env.VITE_USER_POOL_ID,
			userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
			identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
			allowGuestAccess: true,
		},
	},
	API: {
		GraphQL: {
			endpoint: import.meta.env.VITE_API_URL,
			region: import.meta.env.VITE_AWS_REGION,
			defaultAuthMode: "iam",
		},
	},
	Storage: {
		S3: {
			bucket: import.meta.env.VITE_S3_BUCKET,
			region: import.meta.env.VITE_AWS_REGION,
		},
	},
});

function App() {
	return (
		<AppProvider>
			<AppRouter />
		</AppProvider>
	);
}

export default App;
