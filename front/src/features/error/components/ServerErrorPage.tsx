import { ActionButton } from "@/components/button";
import {
	DollarIcon,
	DoorArrowIcon,
	RefreshCircleIcon,
	TriangleExclamationIcon,
} from "@/components/icon";
import type { AppError } from "@/utils/error";

interface ServerErrorPageProps {
	error?: AppError;
}

export const ServerErrorPage = ({ error }: ServerErrorPageProps) => {
	const handleReload = () => {
		window.location.reload();
	};

	const handleGoToLogin = () => {};

	return (
		<div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				{/* エラーアイコン */}
				<div className="text-center mb-8">
					<div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<TriangleExclamationIcon className="text-red-600" size={48} />
					</div>

					<h1 className="text-3xl font-bold text-gray-900 mb-3">
						システムエラーが発生しました
					</h1>
					<p className="text-gray-600 mb-6">
						申し訳ございません。サーバーで予期しないエラーが発生しました。
						<br />
						お手数ですが、再度ログインからやり直してください。
					</p>
				</div>

				{/* エラー詳細（開発環境でのみ表示） */}
				{process.env.NODE_ENV === "development" && error && (
					<div className="bg-gray-100 rounded-lg p-4 mb-6">
						<h3 className="text-sm font-medium text-gray-900 mb-2">
							エラー詳細（開発環境）
						</h3>
						<p className="text-xs text-gray-600 font-mono break-all">
							{error.message}
						</p>
					</div>
				)}

				{/* アクションボタン */}
				<div className="space-y-3">
					<ActionButton
						label={"ログインページに戻る"}
						onClick={handleGoToLogin}
						icon={<DoorArrowIcon className="mr-2" size={20} />}
						variant="destructive"
					/>
					<ActionButton
						label={"ページを再読み込み"}
						onClick={handleReload}
						icon={<RefreshCircleIcon className="mr-2" size={20} />}
						variant="outline"
					/>
				</div>

				{/* サポート情報 */}
				<div className="mt-8 p-4 bg-gray-50 rounded-lg">
					<h3 className="text-sm font-medium text-gray-900 mb-2">
						問題が解決しない場合
					</h3>
					<div className="space-y-2 text-sm text-gray-600">
						<p>• ブラウザのキャッシュをクリアしてください</p>
						<p>• 別のブラウザでお試しください</p>
						<p>• しばらく時間をおいてから再度アクセスしてください</p>
					</div>
				</div>

				{/* ブランディング */}
				<div className="mt-8 text-center">
					<div className="flex items-center justify-center mb-2">
						<div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center mr-2">
							<DollarIcon className="text-white" size={20} />
						</div>
						<span className="text-lg font-semibold text-gray-800">
							支出管理
						</span>
					</div>
					<p className="text-xs text-gray-500">
						ご不便をおかけして申し訳ございません
					</p>
				</div>
			</div>
		</div>
	);
};
