"use client";

import type React from "react";

import { CrossIcon, UploadIcon } from "@/components/icon";
import { BaseModal } from "@/components/notification/BaseModal";
import { Button } from "@/components/ui";
import { useExpense } from "@/features/home/components/dashboard/expense-context";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface CsvUploadModalProps {
	isOpen: boolean;
	onClose: () => void;
}

interface CsvRow {
	date: string;
	category: string;
	subcategory: string;
	amount: number;
	description: string;
}

// --- 小コンポーネント定義 ---

const CsvErrorAlert = ({
	errors,
	type,
}: { errors: string[]; type: "error" | "warning" }) => {
	if (errors.length === 0) return null;
	const color = type === "error" ? "red" : "yellow";
	const title = type === "error" ? "エラー" : "警告";
	const text = type === "error" ? "text-red-700" : "text-yellow-700";
	const bg =
		type === "error"
			? "bg-red-50 border-red-200"
			: "bg-yellow-50 border-yellow-200";
	const titleColor = type === "error" ? "text-red-800" : "text-yellow-800";
	return (
		<div className={`${bg} border rounded-lg p-4`}>
			<h4 className={`font-medium mb-2 ${titleColor}`}>{title}</h4>
			{type === "warning" && (
				<p className="text-sm text-yellow-700 mb-2">
					以下の行でエラーが発生しました。これらの行はインポートされません：
				</p>
			)}
			<ul className="space-y-1 max-h-32 overflow-y-auto">
				{errors.slice(0, 10).map((error, index) => (
					<li key={index} className={`text-sm ${text}`}>
						• {error}
					</li>
				))}
				{errors.length > 10 && (
					<li className={`text-sm ${text}`}>• ...他 {errors.length - 10} 件</li>
				)}
			</ul>
		</div>
	);
};

const CsvProcessingIndicator = () => {
	return (
		<div className="text-center py-4">
			<div className="inline-flex items-center space-x-2">
				<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
				<span className="text-gray-600">ファイルを処理中...</span>
			</div>
		</div>
	);
};

const CsvFormatInfo = () => {
	return (
		<div className="bg-gray-50 rounded-lg p-4">
			<h3 className="font-medium text-gray-900 mb-3">CSVファイル形式</h3>
			<p className="text-sm text-gray-600 mb-3">
				以下の列を含むCSVファイルをアップロードしてください：
			</p>
			<div className="bg-white rounded border p-3 font-mono text-sm">
				<div className="text-gray-600">
					date,category,subcategory,amount,description
				</div>
				<div className="text-gray-800">2024-06-01,食費,外食,1500,ランチ</div>
				<div className="text-gray-800">2024-06-01,交通費,電車,300,通勤</div>
			</div>
			<div className="mt-3 space-y-1 text-sm text-gray-600">
				<p>
					<strong>date:</strong> 日付 (YYYY-MM-DD形式)
				</p>
				<p>
					<strong>category:</strong> カテゴリ (食費、住居費、交通費、娯楽費)
				</p>
				<p>
					<strong>subcategory:</strong> サブカテゴリ (任意)
				</p>
				<p>
					<strong>amount:</strong> 金額 (数値)
				</p>
				<p>
					<strong>description:</strong> 説明 (任意)
				</p>
			</div>
		</div>
	);
};

const CsvUploadDropArea = ({
	isDragOver,
	onDragOver,
	onDragLeave,
	onDrop,
	onFileSelect,
}: {
	isDragOver: boolean;
	onDragOver: (e: React.DragEvent) => void;
	onDragLeave: (e: React.DragEvent) => void;
	onDrop: (e: React.DragEvent) => void;
	onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
	return (
		<div className="text-center">
			<div
				className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
					isDragOver
						? "border-blue-400 bg-blue-50"
						: "border-gray-300 hover:border-gray-400"
				}`}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
			>
				<div className="flex flex-col items-center space-y-4">
					<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
						<UploadIcon className="text-blue-600" size={32} />
					</div>
					<div>
						<p className="text-lg font-medium text-gray-900">
							CSVファイルをドラッグ&ドロップ
						</p>
						<p className="text-gray-600">または</p>
					</div>
					<label className="cursor-pointer">
						<input
							type="file"
							accept=".csv"
							onChange={onFileSelect}
							className="hidden"
						/>
						<Button variant="outline">ファイルを選択</Button>
					</label>
				</div>
			</div>
		</div>
	);
};

const CsvPreviewHeader = ({
	count,
	onBack,
	onImport,
}: { count: number; onBack: () => void; onImport: () => void }) => {
	return (
		<div className="flex items-center justify-between">
			<div>
				<h3 className="text-lg font-medium text-gray-900">
					{count}件のデータが見つかりました
				</h3>
				<p className="text-gray-600">内容を確認してインポートしてください</p>
			</div>
			<div className="flex space-x-3">
				<Button variant="outline" onClick={onBack}>
					戻る
				</Button>
				<Button onClick={onImport}>インポート実行</Button>
			</div>
		</div>
	);
};

const CsvPreviewTable = ({ csvData }: { csvData: CsvRow[] }) => {
	return (
		<div className="border border-gray-200 rounded-lg overflow-hidden">
			<div className="overflow-x-auto max-h-96">
				<table className="w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								日付
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								カテゴリ
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								サブカテゴリ
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								金額
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
								説明
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{csvData.slice(0, 50).map((row, index) => (
							<tr key={index} className="hover:bg-gray-50">
								<td className="px-4 py-3 text-sm text-gray-900">{row.date}</td>
								<td className="px-4 py-3 text-sm text-gray-900">
									{row.category}
								</td>
								<td className="px-4 py-3 text-sm text-gray-600">
									{row.subcategory || "-"}
								</td>
								<td className="px-4 py-3 text-sm font-medium text-gray-900">
									¥{row.amount.toLocaleString()}
								</td>
								<td className="px-4 py-3 text-sm text-gray-600">
									{row.description || "-"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{csvData.length > 50 && (
					<div className="p-4 text-center text-sm text-gray-600 bg-gray-50">
						...他 {csvData.length - 50} 件のデータ
					</div>
				)}
			</div>
		</div>
	);
};

const CsvImportSuccess = ({ count }: { count: number }) => {
	return (
		<div className="text-center py-8">
			<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
					className="text-green-600"
				>
					<path d="M20 6 9 17l-5-5" />
				</svg>
			</div>
			<h3 className="text-lg font-medium text-gray-900 mb-2">
				インポートが完了しました
			</h3>
			<p className="text-gray-600">
				{count}件のデータが正常にインポートされました
			</p>
		</div>
	);
};

// --- メインコンポーネント ---

export const CsvUploadModal = ({ isOpen, onClose }: CsvUploadModalProps) => {
	const [isDragOver, setIsDragOver] = useState(false);
	const [csvData, setCsvData] = useState<CsvRow[]>([]);
	const [errors, setErrors] = useState<string[]>([]);
	const [isProcessing, setIsProcessing] = useState(false);
	const [step, setStep] = useState<"upload" | "preview" | "success">("upload");

	const { mainCategories, addSubCategoriesFromData } = useExpense();

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);

		const files = Array.from(e.dataTransfer.files);
		const csvFiles = files.filter(
			(file) => file.type === "text/csv" || file.name.endsWith(".csv"),
		);
		const nonCsvFiles = files.filter(
			(file) => !(file.type === "text/csv" || file.name.endsWith(".csv")),
		);

		// 非CSVファイルの警告通知
		if (nonCsvFiles.length > 0) {
			for (const file of nonCsvFiles) {
				toast.warning("ファイル形式エラー", {
					description: `${file.name} はCSVファイルではありません`,
					duration: 4000,
				});
			}
		}

		// CSVファイルの処理
		if (csvFiles.length > 0) {
			if (csvFiles.length === 1) {
				processCsvFile(csvFiles[0]);
			} else {
				// 複数ファイルの場合
				toast.info("複数ファイル処理開始", {
					description: `${csvFiles.length}個のCSVファイルを順次処理します`,
				});
				csvFiles.forEach((file, index) => {
					setTimeout(() => {
						processCsvFile(file);
					}, index * 500); // 500ms間隔で処理
				});
			}
		} else {
			setErrors(["CSVファイルを選択してください。"]);
			toast.error("ファイル選択エラー", {
				description: "CSVファイルを選択してください",
			});
		}
	}, []);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			processCsvFile(file);
		}
	};

	const processCsvFile = async (file: File) => {
		setIsProcessing(true);
		setErrors([]);

		// 処理開始の通知
		const processingToast = toast.loading(`${file.name} を処理中...`, {
			description: "ファイルを読み込んでいます",
		});

		try {
			const text = await file.text();
			const lines = text.split("\n").filter((line) => line.trim());

			if (lines.length < 2) {
				const error = `${file.name}: CSVファイルにデータが含まれていません。`;
				setErrors([error]);
				toast.dismiss(processingToast);
				toast.error("ファイル処理エラー", {
					description: error,
					action: {
						label: "再試行",
						onClick: () => processCsvFile(file),
					},
				});
				setIsProcessing(false);
				return;
			}

			const headers = lines[0]
				.split(",")
				.map((h) => h.trim().replace(/"/g, ""));
			const expectedHeaders = [
				"date",
				"category",
				"subcategory",
				"amount",
				"description",
			];

			const missingHeaders = expectedHeaders.filter(
				(h) => !headers.includes(h),
			);
			if (missingHeaders.length > 0) {
				const error = `${file.name}: 必要な列が不足しています: ${missingHeaders.join(", ")}`;
				setErrors([error]);
				toast.dismiss(processingToast);
				toast.error("ファイル形式エラー", {
					description: error,
					action: {
						label: "形式確認",
						onClick: () => {
							toast.info("CSVファイル形式", {
								description:
									"date,category,subcategory,amount,description の列が必要です",
								duration: 8000,
							});
						},
					},
				});
				setIsProcessing(false);
				return;
			}

			const data: CsvRow[] = [];
			const newErrors: string[] = [];

			for (let i = 1; i < lines.length; i++) {
				const values = lines[i]
					.split(",")
					.map((v) => v.trim().replace(/"/g, ""));

				if (values.length !== headers.length) {
					newErrors.push(`行 ${i + 1}: 列数が一致しません`);
					continue;
				}

				const row: any = {};
				headers.forEach((header, index) => {
					row[header] = values[index];
				});

				// データ検証
				if (!row.date || !row.category || !row.amount) {
					newErrors.push(`行 ${i + 1}: 必須項目が不足しています`);
					continue;
				}

				const amount = Number.parseFloat(row.amount);
				if (isNaN(amount) || amount <= 0) {
					newErrors.push(`行 ${i + 1}: 金額が無効です`);
					continue;
				}

				// カテゴリ検証
				const categoryExists = mainCategories.some(
					(cat) => cat.name === row.category || cat.id === row.category,
				);
				if (!categoryExists) {
					newErrors.push(`行 ${i + 1}: 無効なカテゴリです (${row.category})`);
					continue;
				}

				data.push({
					date: row.date,
					category: row.category,
					subcategory: row.subcategory || "",
					amount: amount,
					description: row.description || "",
				});
			}

			toast.dismiss(processingToast);

			if (newErrors.length > 0) {
				setErrors(newErrors);
				toast.warning("データ検証警告", {
					description: `${file.name}: ${newErrors.length}件のエラーが見つかりました`,
					action: {
						label: "詳細確認",
						onClick: () => setStep("preview"),
					},
				});
			}

			setCsvData(data);
			setStep("preview");

			// 成功通知
			toast.success("ファイル読み込み完了", {
				description: `${file.name}: ${data.length}件のデータを読み込みました`,
				action: {
					label: "プレビュー",
					onClick: () => setStep("preview"),
				},
			});
		} catch (error) {
			const errorMessage = `${file.name}: ファイルの読み込みに失敗しました。`;
			setErrors([errorMessage]);
			toast.dismiss(processingToast);
			toast.error("ファイル読み込みエラー", {
				description: errorMessage,
				action: {
					label: "再試行",
					onClick: () => processCsvFile(file),
				},
			});
		}

		setIsProcessing(false);
	};

	const handleImport = () => {
		// インポート開始の通知
		const importToast = toast.loading("データをインポート中...", {
			description: `${csvData.length}件のデータを処理しています`,
		});

		// サブカテゴリを抽出
		const categorySubcategoryMap: Record<string, string[]> = {};

		for (const row of csvData) {
			if (row.category && row.subcategory) {
				if (!categorySubcategoryMap[row.category]) {
					categorySubcategoryMap[row.category] = [];
				}
				if (!categorySubcategoryMap[row.category].includes(row.subcategory)) {
					categorySubcategoryMap[row.category].push(row.subcategory);
				}
			}
		}

		// サブカテゴリをコンテキストに追加
		addSubCategoriesFromData(categorySubcategoryMap);

		// ここで実際のデータインポート処理を行う
		setTimeout(() => {
			setStep("success");
			toast.dismiss(importToast);

			// 抽出されたサブカテゴリの数を計算
			const totalSubcategories = Object.values(categorySubcategoryMap).reduce(
				(sum, subs) => sum + subs.length,
				0,
			);

			// インポート成功通知
			toast.success("データインポート完了", {
				description: `${csvData.length}件のデータと${totalSubcategories}個のサブカテゴリがインポートされました`,
				duration: 6000,
				action: {
					label: "ダッシュボードを見る",
					onClick: () => {
						onClose();
						resetModal();
					},
				},
			});

			setTimeout(() => {
				onClose();
				resetModal();
			}, 2000);
		}, 1500);
	};

	const resetModal = () => {
		setStep("upload");
		setCsvData([]);
		setErrors([]);
		setIsProcessing(false);
	};

	const handleClose = () => {
		onClose();
		resetModal();
	};

	if (!isOpen) return null;

	return (
		<BaseModal
			title={
				step === "upload"
					? "CSVファイルをアップロード"
					: step === "preview"
						? "データプレビュー"
						: "インポート完了"
			}
			onClose={handleClose}
			isOpen={isOpen}
			maxWidthClass="max-w-4xl"
		>
			<div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
				{step === "upload" && (
					<div className="space-y-6">
						<CsvUploadDropArea
							isDragOver={isDragOver}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							onFileSelect={handleFileSelect}
						/>
						<CsvFormatInfo />
						<CsvErrorAlert errors={errors} type="error" />
						{isProcessing && <CsvProcessingIndicator />}
					</div>
				)}
				{step === "preview" && (
					<div className="space-y-6">
						<CsvPreviewHeader
							count={csvData.length}
							onBack={() => setStep("upload")}
							onImport={handleImport}
						/>
						<CsvErrorAlert errors={errors} type="warning" />
						<CsvPreviewTable csvData={csvData} />
					</div>
				)}
				{step === "success" && <CsvImportSuccess count={csvData.length} />}
			</div>
		</BaseModal>
	);
};
