import type React from "react";

import { IconButton } from "@/components/button";
import { Button } from "@/components/ui";
import { useExpense } from "@/features/home/components/dashboard/expense-context";
import { SubcategoryModal } from "@/features/home/components/sidebar/SubcategoryModal";
import { ChevronDown, ChevronRight, Settings } from "lucide-react";
import { useState } from "react";

// SidebarAllCategoriesButton: すべてのカテゴリボタン
const SidebarAllCategoriesButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<Button
			className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white"
			onClick={onClick}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<rect width="3" height="3" x="9" y="9" />
				<rect width="3" height="3" x="15" y="9" />
				<rect width="3" height="3" x="9" y="15" />
				<rect width="3" height="3" x="15" y="15" />
			</svg>
			すべてのカテゴリ
		</Button>
	);
};

// SidebarCategoryButton: メインカテゴリボタン
const SidebarCategoryButton = ({
	category,
	isSelected,
	isExpanded,
	onClick,
	onManageSubcategory,
	onToggleExpand,
	getIcon,
}: {
	category: any;
	isSelected: boolean;
	isExpanded: boolean;
	onClick: () => void;
	onManageSubcategory: (e: React.MouseEvent) => void;
	onToggleExpand: () => void;
	getIcon: (iconName: string) => React.ReactNode;
}) => {
	return (
		<div className="flex items-center">
			<Button
				variant="ghost"
				className={`flex-1 justify-start gap-3 h-12 ${
					isSelected
						? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
						: "bg-transparent"
				}`}
				onClick={onClick}
			>
				<div
					className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center text-white`}
				>
					{getIcon(category.icon)}
				</div>
				<span className="font-medium">{category.name}</span>
			</Button>
			<div className="flex items-center">
				<IconButton
					icon={<Settings className="h-4 w-4" />}
					variant="ghost"
					size="icon"
					onClick={onManageSubcategory}
					className="bg-transparent p-1 h-8 w-8 text-gray-500"
					title="サブカテゴリを管理"
				/>
				<IconButton
					icon={
						isExpanded ? (
							<ChevronDown className="h-4 w-4" />
						) : (
							<ChevronRight className="h-4 w-4" />
						)
					}
					variant="ghost"
					size="icon"
					onClick={onToggleExpand}
					className="bg-transparent p-1 h-8 w-8"
				/>
			</div>
		</div>
	);
};

// SidebarSubCategoryList: サブカテゴリリスト
const SidebarSubCategoryList = ({
	subCategories,
	selectedSubCategory,
	onSelect,
}: {
	subCategories: any[];
	selectedSubCategory: string | null;
	onSelect: (subCategoryId: string) => void;
}) => {
	if (subCategories.length === 0) {
		return (
			<li className="ml-3 py-2 text-xs text-gray-500">
				表示中のサブカテゴリがありません
			</li>
		);
	}
	return (
		<>
			{subCategories.map((subCategory) => {
				const isSubSelected = selectedSubCategory === subCategory.id;
				return (
					<li key={subCategory.id}>
						<Button
							variant="ghost"
							className={`w-full justify-start gap-3 h-10 ${
								isSubSelected
									? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
									: "bg-transparent"
							}`}
							onClick={() => onSelect(subCategory.id)}
						>
							<div className={`w-3 h-3 rounded-full ${subCategory.color}`} />
							<span className="text-sm">{subCategory.name}</span>
						</Button>
					</li>
				);
			})}
		</>
	);
};

// SidebarCategoryList: メインカテゴリリスト
const SidebarCategoryList = ({
	mainCategories,
	expandedCategories,
	selectedMainCategory,
	selectedSubCategory,
	toggleExpanded,
	setSelectedMainCategory,
	setSelectedSubCategory,
	getVisibleSubCategories,
	openSubcategoryModal,
	getIcon,
}: {
	mainCategories: any[];
	expandedCategories: string[];
	selectedMainCategory: string;
	selectedSubCategory: string | null;
	toggleExpanded: (categoryId: string) => void;
	setSelectedMainCategory: (id: string) => void;
	setSelectedSubCategory: (id: string | null) => void;
	getVisibleSubCategories: (categoryId: string) => any[];
	openSubcategoryModal: (categoryId: string, e: React.MouseEvent) => void;
	getIcon: (iconName: string) => React.ReactNode;
}) => {
	return (
		<ul className="space-y-2">
			{mainCategories.map((category) => {
				const isExpanded = expandedCategories.includes(category.id);
				const isSelected =
					selectedMainCategory === category.id && !selectedSubCategory;
				return (
					<li key={category.id}>
						<SidebarCategoryButton
							category={category}
							isSelected={isSelected}
							isExpanded={isExpanded}
							onClick={() => {
								setSelectedMainCategory(category.id);
								setSelectedSubCategory(null);
								if (!isExpanded) toggleExpanded(category.id);
							}}
							onManageSubcategory={(e) => openSubcategoryModal(category.id, e)}
							onToggleExpand={() => toggleExpanded(category.id)}
							getIcon={getIcon}
						/>
						{isExpanded && (
							<ul className="ml-6 mt-2 space-y-1">
								<SidebarSubCategoryList
									subCategories={getVisibleSubCategories(category.id)}
									selectedSubCategory={selectedSubCategory}
									onSelect={(subCategoryId) => {
										setSelectedMainCategory(category.id);
										setSelectedSubCategory(subCategoryId);
									}}
								/>
							</ul>
						)}
					</li>
				);
			})}
		</ul>
	);
};

// SidebarSummary: サマリーカード
const SidebarSummary = () => {
	// TODO: 必要に応じてprops化やデータ取得を行う
	return (
		<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
			<h3 className="font-semibold text-gray-800 mb-2">今月の支出</h3>
			<p className="text-2xl font-bold text-blue-600">¥203,000</p>
			<p className="text-sm text-gray-600 mt-1">前月比 +5.2%</p>
		</div>
	);
};

export const Sidebar = () => {
	const {
		selectedMainCategory,
		selectedSubCategory,
		setSelectedMainCategory,
		setSelectedSubCategory,
		mainCategories,
		getVisibleSubCategories,
	} = useExpense();

	const [expandedCategories, setExpandedCategories] = useState<string[]>([
		selectedMainCategory,
	]);
	const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
	const [selectedCategoryForModal, setSelectedCategoryForModal] =
		useState<string>("");

	const toggleExpanded = (categoryId: string) => {
		setExpandedCategories((prev) =>
			prev.includes(categoryId)
				? prev.filter((id) => id !== categoryId)
				: [...prev, categoryId],
		);
	};

	const openSubcategoryModal = (categoryId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setSelectedCategoryForModal(categoryId);
		setIsSubcategoryModalOpen(true);
	};

	const getIcon = (iconName: string) => {
		const iconProps = {
			width: "20",
			height: "20",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round" as const,
			strokeLinejoin: "round" as const,
		};
		switch (iconName) {
			case "utensils":
				return (
					<svg {...iconProps}>
						<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
						<path d="M7 2v20" />
						<path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z" />
					</svg>
				);
			case "home":
				return (
					<svg {...iconProps}>
						<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
						<polyline points="9 22 9 12 15 12 15 22" />
					</svg>
				);
			case "car":
				return (
					<svg {...iconProps}>
						<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 9c-.3-.6-.9-1-1.5-1H7.1c-.6 0-1.2.4-1.5 1L3.5 11.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" />
						<circle cx="7" cy="17" r="2" />
						<circle cx="17" cy="17" r="2" />
					</svg>
				);
			case "gamepad-2":
				return (
					<svg {...iconProps}>
						<line x1="6" x2="10" y1="12" y2="12" />
						<line x1="8" x2="8" y1="10" y2="14" />
						<line x1="15" x2="15.01" y1="13" y2="13" />
						<line x1="18" x2="18.01" y1="11" y2="11" />
						<rect width="20" height="12" x="2" y="6" rx="2" />
					</svg>
				);
			default:
				return null;
		}
	};

	return (
		<div className="w-80 border-r border-gray-200 bg-white flex flex-col">
			<div className="p-6">
				<h2 className="text-lg font-semibold text-gray-800 mb-4">
					支出カテゴリ
				</h2>
				<SidebarAllCategoriesButton
					onClick={() => {
						setSelectedMainCategory("");
						setSelectedSubCategory(null);
					}}
				/>
			</div>
			<nav className="flex-1 overflow-auto px-3">
				<SidebarCategoryList
					mainCategories={mainCategories}
					expandedCategories={expandedCategories}
					selectedMainCategory={selectedMainCategory}
					selectedSubCategory={selectedSubCategory}
					toggleExpanded={toggleExpanded}
					setSelectedMainCategory={setSelectedMainCategory}
					setSelectedSubCategory={setSelectedSubCategory}
					getVisibleSubCategories={getVisibleSubCategories}
					openSubcategoryModal={openSubcategoryModal}
					getIcon={getIcon}
				/>
			</nav>
			<div className="p-6 border-t border-gray-200">
				<SidebarSummary />
			</div>
			<SubcategoryModal
				isOpen={isSubcategoryModalOpen}
				onClose={() => setIsSubcategoryModalOpen(false)}
				mainCategoryId={selectedCategoryForModal}
			/>
		</div>
	);
};
