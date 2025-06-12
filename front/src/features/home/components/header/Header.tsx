import { AccountIcon } from "@/components/icon/AccountIcon";
import { DollarIcon } from "@/components/icon/DollarIcon";
import { DownloadIcon } from "@/components/icon/DownloadIcon";
import { MagnifierIcon } from "@/components/icon/MagnifierIcon";
import { PlusIcon } from "@/components/icon/PlusIcon";
import { Button, Input } from "@/components/ui";
import { AccountMenu } from "@/features/home/components/header/AccountMenu";
import { CsvUploadModal } from "@/features/home/components/header/CSVUploadModal";
import { useState } from "react";

export const Header = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

	return (
		<>
			<header className="border-b border-gray-200 bg-white shadow-sm">
				<div className="flex items-center h-16 px-6">
					<div className="flex items-center mr-6">
						<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
							<DollarIcon className="text-white" size={20} />
						</div>
						<span className="text-xl font-semibold text-gray-800">
							支出管理
						</span>
					</div>

					<div className="relative flex-1 max-w-md">
						<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<MagnifierIcon className="text-gray-400" size={18} />
						</div>
						<Input
							type="search"
							placeholder="支出データを検索"
							className="pl-10 bg-gray-50 border-gray-200"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="flex items-center ml-auto space-x-3">
						<Button variant="outline" size="sm">
							<DownloadIcon className="mr-2" size={16} />
							エクスポート
						</Button>
						<Button size="sm" onClick={() => setIsUploadModalOpen(true)}>
							<PlusIcon className="mr-2" size={16} />
							支出を追加
						</Button>
						<AccountMenu />
					</div>
				</div>
			</header>

			<CsvUploadModal
				isOpen={isUploadModalOpen}
				onClose={() => setIsUploadModalOpen(false)}
			/>
		</>
	);
};
