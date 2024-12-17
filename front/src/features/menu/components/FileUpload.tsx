import { useS3FileUpload } from "@/features/menu/hooks/useS3FileUpload";
import { Button } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { memo, useRef } from "react";
import type { FC, RefObject } from "react";
import { LuFilePlus2 } from "react-icons/lu";

type UploadButtonProps = {
	openRef: RefObject<() => void>;
};

export const FileUpload: FC = memo(() => {
	const openRef = useRef<() => void>(null);
	const { /*loading,*/ errMsg, upload } = useS3FileUpload();

	const handleDrop = async (files: File[]) => {
		if (files.length === 0) return;

		// Upload the file to S3
		for (const file of files) {
			await upload(file);
		}
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

FileUpload.displayName = "FileUpload";
UploadButton.displayName = "UploadButton";
