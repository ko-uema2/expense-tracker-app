import { useEffect, useState } from "react";

interface LoadingScreenProps {
	message?: string;
	showProgressBar?: boolean;
}

export const LoadingScreen = ({
	message = "読み込み中...",
	showProgressBar = true,
}: LoadingScreenProps) => {
	const [progress, setProgress] = useState(0);

	// プログレスバーのアニメーション
	useEffect(() => {
		const timer = setTimeout(() => {
			setProgress(10);
		}, 100);

		const interval = setInterval(() => {
			setProgress((prevProgress) => {
				const increment = Math.floor(Math.random() * 10) + 1;
				const newProgress = Math.min(prevProgress + increment, 90);
				return newProgress;
			});
		}, 500);

		return () => {
			clearTimeout(timer);
			clearInterval(interval);
		};
	}, []);

	return (
		<div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center z-50">
			<div className="w-full max-w-md px-8 py-12">
				{/* ロゴとブランディング */}
				<div className="flex items-center justify-center mb-8">
					<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-white"
						>
							<line x1="12" x2="12" y1="1" y2="23" />
							<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
						</svg>
					</div>
					<h1 className="text-3xl font-bold text-gray-900">支出管理</h1>
				</div>

				{/* ローディングアニメーション */}
				<div className="flex flex-col items-center">
					<div className="relative">
						<div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-8 h-8 bg-white rounded-full" />
						</div>
					</div>

					{/* メッセージ */}
					<p className="mt-6 text-lg font-medium text-gray-800">{message}</p>

					{/* プログレスバー */}
					{showProgressBar && (
						<div className="w-full mt-4">
							<div className="w-full bg-gray-200 rounded-full h-2 mt-2">
								<div
									className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
									style={{ width: `${progress}%` }}
								/>
							</div>
							<div className="flex justify-between mt-1">
								<span className="text-xs text-gray-500">準備中...</span>
								<span className="text-xs text-gray-500">{progress}%</span>
							</div>
						</div>
					)}
				</div>

				{/* ヒントメッセージ */}
				<div className="mt-12 text-center">
					<p className="text-sm text-gray-600">{getRandomTip()}</p>
				</div>
			</div>
		</div>
	);
};

// ランダムなヒントメッセージを表示
const getRandomTip = (): string => {
	const tips = [
		"予算を設定すると、支出を効果的に管理できます。",
		"定期的な支出の確認で、無駄な出費を見つけやすくなります。",
		"カテゴリ別の分析で、支出パターンを把握しましょう。",
		"CSVファイルをインポートして、簡単にデータを追加できます。",
		"月次レポートで、支出の傾向を確認できます。",
		"サブカテゴリを活用して、より詳細な支出管理を行いましょう。",
		"ダークモードは夜間の使用に最適です。",
		"データは自動的に保存されます。",
	];

	return tips[Math.floor(Math.random() * tips.length)];
};
