import { Authenticator } from "@aws-amplify/ui-react";
import { MantineProvider, createTheme } from "@mantine/core";
import { type ReactNode, memo } from "react";
import { BrowserRouter } from "react-router-dom";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";

type AppProviderProps = {
	children: ReactNode;
};

const theme = createTheme({
	primaryColor: "primary",
	primaryShade: {
		light: 9,
	},
	defaultRadius: "md",
	colors: {
		primary: [
			"#f1f5fd", // 50
			"#e0e8f9", // 100
			"#c9d7f4", // 200
			"#a3bded", // 300
			"#789ae2", // 400
			"#587ad9", // 500
			"#435ecd", // 600
			"#3b4ec0", // 700
			"#344099", // 800
			"#2f3979", // 900
			"#20254b", // 950
		],
		secondary: [
			"#fff8eb", // 50
			"#fdebc8", // 100
			"#fad68d", // 200
			"#f8be59", // 300
			"#f6a229", // 400
			"#ef8011", // 500
			"#d45d0b", // 600
			"#b03f0d", // 700
			"#8f3111", // 800
			"#752912", // 900
			"#431205", // 950
		],
		base: [
			"#fafafa", // 50
			"#f2f4f5", // 100
			"#e8eaec", // 200
			"#d6dadc", // 300
			"#bbc1c5", // 400
			"#a4acb2", // 500
			"#868f97", // 600
			"#707880", // 700
			"#5e656b", // 800
			"#4d5256", // 900
			"#31363a", // 950
		],
		danger: [
			"#fff0f0", // 50
			"#ffdede", // 100
			"#ffc3c3", // 200
			"#ff9a9a", // 300
			"#ff6060", // 400
			"#ff2e2e", // 500
			"#f41f1f", // 600
			"#cd0808", // 700
			"#a90b0b", // 800
			"#8b1111", // 900
			"#4d0202", // 950
		],
	},
});

export const AppProvider = memo(({ children }: AppProviderProps) => {
	return (
		<MantineProvider defaultColorScheme="light" theme={theme}>
			<Authenticator.Provider>
				<BrowserRouter>{children}</BrowserRouter>
			</Authenticator.Provider>
		</MantineProvider>
	);
});
