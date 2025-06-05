"use client";

import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

export interface SubCategory {
	id: string;
	name: string;
	color: string;
	isVisible: boolean; // 表示・非表示の状態
	isFromData: boolean; // データから抽出されたかどうか
}

export interface MainCategory {
	id: string;
	name: string;
	icon: string;
	color: string;
	subCategories: SubCategory[];
}

export interface ExpenseData {
	month: string;
	[key: string]: number | string;
}

interface ExpenseContextType {
	selectedMainCategory: string;
	selectedSubCategory: string | null;
	setSelectedMainCategory: (id: string) => void;
	setSelectedSubCategory: (id: string | null) => void;
	mainCategories: MainCategory[];
	expenseData: ExpenseData[];
	toggleSubCategoryVisibility: (
		mainCategoryId: string,
		subCategoryId: string,
	) => void;
	addSubCategoriesFromData: (
		categorySubcategoryMap: Record<string, string[]>,
	) => void;
	getVisibleSubCategories: (mainCategoryId: string) => SubCategory[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpense = () => {
	const context = useContext(ExpenseContext);
	if (!context) {
		throw new Error("useExpense must be used within an ExpenseProvider");
	}
	return context;
};

// ローカルストレージのキー
const STORAGE_KEY = "expense-categories";

// カテゴリ名のマッピング（日本語 ⇔ 英語ID）
const CATEGORY_MAPPING: Record<string, string> = {
	食費: "food",
	住居費: "housing",
	交通費: "transport",
	娯楽費: "entertainment",
	food: "食費",
	housing: "住居費",
	transport: "交通費",
	entertainment: "娯楽費",
};

// サブカテゴリのデフォルトカラー
const DEFAULT_COLORS = [
	"bg-red-400",
	"bg-red-500",
	"bg-red-600",
	"bg-orange-400",
	"bg-orange-500",
	"bg-orange-600",
	"bg-yellow-400",
	"bg-yellow-500",
	"bg-yellow-600",
	"bg-green-400",
	"bg-green-500",
	"bg-green-600",
	"bg-blue-400",
	"bg-blue-500",
	"bg-blue-600",
	"bg-purple-400",
	"bg-purple-500",
	"bg-purple-600",
	"bg-pink-400",
	"bg-pink-500",
	"bg-pink-600",
	"bg-gray-400",
	"bg-gray-500",
	"bg-gray-600",
];

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
	const [selectedMainCategory, setSelectedMainCategory] = useState("food");
	const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
		null,
	);

	// デフォルトのカテゴリ（サンプルサブカテゴリ付き）
	const defaultCategories: MainCategory[] = [
		{
			id: "food",
			name: "食費",
			icon: "utensils",
			color: "bg-orange-500",
			subCategories: [
				{
					id: "dining",
					name: "外食",
					color: "bg-orange-400",
					isVisible: true,
					isFromData: false,
				},
				{
					id: "groceries",
					name: "食材",
					color: "bg-orange-500",
					isVisible: true,
					isFromData: false,
				},
				{
					id: "beverages",
					name: "飲み物",
					color: "bg-orange-600",
					isVisible: true,
					isFromData: false,
				},
				{
					id: "convenience",
					name: "コンビニ",
					color: "bg-red-400",
					isVisible: true,
					isFromData: false,
				},
				{
					id: "delivery",
					name: "デリバリー",
					color: "bg-red-500",
					isVisible: true,
					isFromData: false,
				},
			],
		},
		{
			id: "housing",
			name: "住居費",
			icon: "home",
			color: "bg-blue-500",
			subCategories: [
				{
					id: "rent",
					name: "家賃",
					color: "bg-blue-400",
					isVisible: true,
					isFromData: false,
				},
				{
					id: "utilities",
					name: "光熱費",
					color: "bg-blue-500",
					isVisible: true,
					isFromData: false,
				},
				{
					id: "internet",
					name: "通信費",
					color: "bg-blue-600",
					isVisible: true,
					isFromData: false,
				},
				{
					id: "maintenance",
					name: "修繕費",
					color: "bg-cyan-400",
					isVisible: true,
					isFromData: false,
				},
			],
		},
		{
			id: "transport",
			name: "交通費",
			icon: "car",
			color: "bg-green-500",
			subCategories: [
				{
					id: "train",
					name: "電車",
					color: "bg-green-400",
					isVisible: true,
					isFromData: false,
				},
				{
					id: "bus",
					name: "バス",
					color: "bg-green-500",
					isVisible: true,
					isFromData: false,
				},
				{
					id: "gas",
					name: "ガソリン",
					color: "bg-green-600",
					isVisible: true,
					isFromData: false,
				},
				{
					id: "taxi",
					name: "タクシー",
					color: "bg-emerald-400",
					isVisible: true,
					isFromData: false,
				},
			],
		},
		{
			id: "entertainment",
			name: "娯楽費",
			icon: "gamepad-2",
			color: "bg-purple-500",
			subCategories: [
				{
					id: "movies",
					name: "映画",
					color: "bg-purple-400",
					isVisible: true,
					isFromData: false,
				},
				{
					id: "books",
					name: "書籍",
					color: "bg-purple-500",
					isVisible: true,
					isFromData: false,
				},
				{
					id: "games",
					name: "ゲーム",
					color: "bg-purple-600",
					isVisible: true,
					isFromData: false,
				},
				{
					id: "travel",
					name: "旅行",
					color: "bg-pink-400",
					isVisible: true,
					isFromData: false,
				},
				{
					id: "sports",
					name: "スポーツ",
					color: "bg-pink-500",
					isVisible: true,
					isFromData: false,
				},
			],
		},
	];

	const [mainCategories, setMainCategories] =
		useState<MainCategory[]>(defaultCategories);

	// ローカルストレージからカテゴリを読み込む
	useEffect(() => {
		const savedCategories = localStorage.getItem(STORAGE_KEY);
		if (savedCategories) {
			try {
				setMainCategories(JSON.parse(savedCategories));
			} catch (error) {
				console.error("Failed to parse saved categories:", error);
			}
		}
	}, []);

	// カテゴリが変更されたらローカルストレージに保存
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(mainCategories));
	}, [mainCategories]);

	// サブカテゴリの表示・非表示を切り替え
	const toggleSubCategoryVisibility = (
		mainCategoryId: string,
		subCategoryId: string,
	) => {
		setMainCategories((prev) =>
			prev.map((category) => {
				if (category.id === mainCategoryId) {
					return {
						...category,
						subCategories: category.subCategories.map((sub) =>
							sub.id === subCategoryId
								? { ...sub, isVisible: !sub.isVisible }
								: sub,
						),
					};
				}
				return category;
			}),
		);

		// 非表示にしたサブカテゴリが選択中の場合は選択を解除
		if (selectedSubCategory === subCategoryId) {
			const category = mainCategories.find((cat) => cat.id === mainCategoryId);
			const subCategory = category?.subCategories.find(
				(sub) => sub.id === subCategoryId,
			);
			if (subCategory && !subCategory.isVisible) {
				setSelectedSubCategory(null);
			}
		}
	};

	// データからサブカテゴリを追加
	const addSubCategoriesFromData = (
		categorySubcategoryMap: Record<string, string[]>,
	) => {
		setMainCategories((prev) => {
			return prev.map((category) => {
				// カテゴリ名またはIDでマッピング
				const categoryKey = CATEGORY_MAPPING[category.name] || category.id;
				const subcategoriesFromData =
					categorySubcategoryMap[categoryKey] ||
					categorySubcategoryMap[category.name] ||
					categorySubcategoryMap[category.id] ||
					[];

				if (subcategoriesFromData.length === 0) {
					return category;
				}

				// 既存のサブカテゴリ名を取得
				const existingSubNames = new Set(
					category.subCategories.map((sub) => sub.name),
				);

				// 新しいサブカテゴリを作成
				const newSubCategories = subcategoriesFromData
					.filter(
						(subName) =>
							subName &&
							subName.trim() &&
							!existingSubNames.has(subName.trim()),
					)
					.map((subName, index) => ({
						id: `${category.id}-${subName.trim().replace(/\s+/g, "-")}-${Date.now()}-${index}`,
						name: subName.trim(),
						color:
							DEFAULT_COLORS[
								(category.subCategories.length + index) % DEFAULT_COLORS.length
							],
						isVisible: true,
						isFromData: true,
					}));

				return {
					...category,
					subCategories: [...category.subCategories, ...newSubCategories],
				};
			});
		});
	};

	// 表示中のサブカテゴリのみを取得
	const getVisibleSubCategories = (mainCategoryId: string): SubCategory[] => {
		const category = mainCategories.find((cat) => cat.id === mainCategoryId);
		return category
			? category.subCategories.filter((sub) => sub.isVisible)
			: [];
	};

	// サンプル支出データ（サブカテゴリ込み）
	const expenseData: ExpenseData[] = [
		{
			month: "1月",
			// メインカテゴリ
			food: 45000,
			housing: 120000,
			transport: 15000,
			entertainment: 25000,
			// 食費サブカテゴリ
			dining: 20000,
			groceries: 18000,
			beverages: 4000,
			convenience: 2000,
			delivery: 1000,
			// 住居費サブカテゴリ
			rent: 80000,
			utilities: 25000,
			internet: 12000,
			maintenance: 3000,
			// 交通費サブカテゴリ
			train: 8000,
			bus: 3000,
			gas: 3000,
			taxi: 1000,
			// 娯楽費サブカテゴリ
			movies: 3000,
			books: 5000,
			games: 8000,
			travel: 7000,
			sports: 2000,
		},
		{
			month: "2月",
			// メインカテゴリ
			food: 42000,
			housing: 118000,
			transport: 12000,
			entertainment: 22000,
			// 食費サブカテゴリ
			dining: 18000,
			groceries: 17000,
			beverages: 4000,
			convenience: 2000,
			delivery: 1000,
			// 住居費サブカテゴリ
			rent: 80000,
			utilities: 23000,
			internet: 12000,
			maintenance: 3000,
			// 交通費サブカテゴリ
			train: 7000,
			bus: 2000,
			gas: 2000,
			taxi: 1000,
			// 娯楽費サブカテゴリ
			movies: 2000,
			books: 6000,
			games: 6000,
			travel: 5000,
			sports: 3000,
		},
		{
			month: "3月",
			// メインカテゴリ
			food: 48000,
			housing: 125000,
			transport: 18000,
			entertainment: 30000,
			// 食費サブカテゴリ
			dining: 22000,
			groceries: 19000,
			beverages: 4000,
			convenience: 2000,
			delivery: 1000,
			// 住居費サブカテゴリ
			rent: 80000,
			utilities: 30000,
			internet: 12000,
			maintenance: 3000,
			// 交通費サブカテゴリ
			train: 10000,
			bus: 4000,
			gas: 3000,
			taxi: 1000,
			// 娯楽費サブカテゴリ
			movies: 4000,
			books: 6000,
			games: 10000,
			travel: 8000,
			sports: 2000,
		},
		{
			month: "4月",
			// メインカテゴリ
			food: 46000,
			housing: 122000,
			transport: 16000,
			entertainment: 28000,
			// 食費サブカテゴリ
			dining: 21000,
			groceries: 18000,
			beverages: 4000,
			convenience: 2000,
			delivery: 1000,
			// 住居費サブカテゴリ
			rent: 80000,
			utilities: 27000,
			internet: 12000,
			maintenance: 3000,
			// 交通費サブカテゴリ
			train: 9000,
			bus: 3000,
			gas: 3000,
			taxi: 1000,
			// 娯楽費サブカテゴリ
			movies: 3000,
			books: 7000,
			games: 9000,
			travel: 7000,
			sports: 2000,
		},
		{
			month: "5月",
			// メインカテゴリ
			food: 50000,
			housing: 120000,
			transport: 20000,
			entertainment: 35000,
			// 食費サブカテゴリ
			dining: 25000,
			groceries: 18000,
			beverages: 4000,
			convenience: 2000,
			delivery: 1000,
			// 住居費サブカテゴリ
			rent: 80000,
			utilities: 25000,
			internet: 12000,
			maintenance: 3000,
			// 交通費サブカテゴリ
			train: 12000,
			bus: 4000,
			gas: 3000,
			taxi: 1000,
			// 娯楽費サブカテゴリ
			movies: 5000,
			books: 8000,
			games: 10000,
			travel: 10000,
			sports: 2000,
		},
		{
			month: "6月",
			// メインカテゴリ
			food: 44000,
			housing: 119000,
			transport: 14000,
			entertainment: 26000,
			// 食費サブカテゴリ
			dining: 19000,
			groceries: 18000,
			beverages: 4000,
			convenience: 2000,
			delivery: 1000,
			// 住居費サブカテゴリ
			rent: 80000,
			utilities: 24000,
			internet: 12000,
			maintenance: 3000,
			// 交通費サブカテゴリ
			train: 8000,
			bus: 3000,
			gas: 2000,
			taxi: 1000,
			// 娯楽費サブカテゴリ
			movies: 3000,
			books: 6000,
			games: 8000,
			travel: 7000,
			sports: 2000,
		},
	];

	return (
		<ExpenseContext.Provider
			value={{
				selectedMainCategory,
				selectedSubCategory,
				setSelectedMainCategory,
				setSelectedSubCategory,
				mainCategories,
				expenseData,
				toggleSubCategoryVisibility,
				addSubCategoriesFromData,
				getVisibleSubCategories,
			}}
		>
			{children}
		</ExpenseContext.Provider>
	);
};
