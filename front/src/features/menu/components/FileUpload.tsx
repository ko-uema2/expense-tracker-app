import { type FileState, useS3FileUpload } from "@/features/menu/hooks";
import { NoError } from "@/utils/error";
import { Button } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { memo, useCallback, useEffect, useRef } from "react";
import type { FC, RefObject } from "react";
import { LuFilePlus2 } from "react-icons/lu";

type UploadButtonProps = {
	openRef: RefObject<(() => void) | null>;
};

const showNotification = (fileName: string): string => {
	return notifications.show({
		loading: true,
		title: "アップロード中...",
		message: `${fileName} をアップロードしています...`,
		autoClose: false,
		withCloseButton: true,
	});
};

const updateNotification = (
	id: string | undefined,
	title: string,
	message: string,
): void => {
	notifications.update({
		id,
		color: "primary.5",
		loading: false,
		title,
		message,
		autoClose: 3000,
		withCloseButton: true,
	});
};

export const FileUpload: FC = memo(() => {
	const openRef = useRef<() => void>(null);
	const notificationRef = useRef<Record<string, string | undefined>>({});
	const { states, upload } = useS3FileUpload();

	const handleFileState = useCallback(
		(fileName: string, fileState: FileState) => {
			const notificationId = notificationRef.current[fileName];

			if (!notificationId && fileState.isLoading) {
				notificationRef.current[fileName] = showNotification(fileName);
				console.log(
					"🚀 3. ~ useEffect ~ isLoading notificationRef:",
					fileName,
					notificationRef.current[fileName],
				);
				console.log(
					"🚀 4. ~ useEffect ~ isLoading notificationId:",
					fileName,
					notificationId,
				);
			}

			if (fileState.isSuccessful) {
				console.log(
					"🚀 5. ~ useEffect ~ isSuccessful notificationRef:",
					fileName,
					notificationRef.current[fileName],
				);
				console.log(
					"🚀 6. ~ useEffect ~ isSuccessful notificationId:",
					fileName,
					notificationId,
				);

				updateNotification(
					notificationId,
					"アップロード完了",
					`${fileName} が正常にアップロードされました`,
				);
				notificationRef.current[fileName] = undefined;
			}

			if (!(fileState.error instanceof NoError)) {
				console.log(
					"🚀 5. ~ useEffect ~ not NoError notificationRef:",
					fileName,
					notificationRef.current[fileName],
				);
				console.log(
					"🚀 6. ~ useEffect ~ not NoError notificationId:",
					fileName,
					notificationId,
				);

				updateNotification(
					notificationId,
					fileState.error.title,
					fileState.error.message,
				);
				notificationRef.current[fileName] = undefined;
			}
		},
		[],
	);

	useEffect(() => {
		for (const [fileName, fileState] of Object.entries(states.files)) {
			console.log("🚀 1. ~ useEffect ~ fileState:", fileName, fileState);

			console.log(
				"🚀 2. ~ useEffect ~ notificationRef:",
				fileName,
				notificationRef.current[fileName],
			);

			handleFileState(fileName, fileState);

			// 	if (!notificationRef.current[fileName] && fileState.isLoading) {
			// 		const id = notifications.show({
			// 			loading: true,
			// 			title: "Uploading...",
			// 			message: `Uploading ${fileName}...`,
			// 			autoClose: false,
			// 			withCloseButton: true,
			// 		});
			// 		notificationRef.current[fileName] = id;
			// 		console.log(
			// 			"🚀 3. ~ useEffect ~ isLoading notificationRef:",
			// 			fileName,
			// 			notificationRef.current[fileName],
			// 		);
			// 	}

			// 	if (fileState.isSuccessful) {
			// 		const id = notificationRef.current[fileName];

			// 		console.log(
			// 			"🚀 4. ~ useEffect ~ isSuccessful notificationRef:",
			// 			fileName,
			// 			notificationRef.current[fileName],
			// 		);

			// 		notifications.update({
			// 			id,
			// 			loading: false,
			// 			title: "Upload completed",
			// 			message: `${fileName} has been uploaded successfully`,
			// 			autoClose: 5000,
			// 			withCloseButton: true,
			// 		});

			// 		notificationRef.current[fileName] = undefined;
			// 	}

			// 	if (!(fileState.error instanceof NoError)) {
			// 		const id = notificationRef.current[fileName];

			// 		console.log(
			// 			"🚀 5. ~ useEffect ~ not NoError notificationRef:",
			// 			fileName,
			// 			notificationRef.current[fileName],
			// 		);

			// 		notifications.update({
			// 			id,
			// 			loading: false,
			// 			title: fileState.error.title,
			// 			message: fileState.error.message,
			// 			autoClose: 5000,
			// 			withCloseButton: true,
			// 		});

			// 		notificationRef.current[fileName] = undefined;
			// 	}
		}
	}, [states.files, handleFileState]);

	const handleDrop = async (files: File[]) => {
		if (files.length === 0) return;

		// Upload the file to S3
		await upload(files);
	};

	return (
		<>
			<Dropzone
				openRef={openRef}
				onDrop={handleDrop}
				accept={[MIME_TYPES.csv]}
			/>
			<UploadButton openRef={openRef} />
		</>
	);
});

const UploadButton: FC<UploadButtonProps> = memo(({ openRef }) => {
	return (
		<Button
			variant="light"
			color="secondary.4"
			leftSection={<LuFilePlus2 size={18} />}
			onClick={() => openRef.current?.()}
		>
			支出ファイル
		</Button>
	);
});
