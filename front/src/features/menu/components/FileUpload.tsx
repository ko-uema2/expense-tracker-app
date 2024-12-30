import { useS3FileUpload } from "@/features/menu/hooks";
import { NoError } from "@/utils/error";
import { Button } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { memo, useEffect, useRef, useState } from "react";
import type { FC, RefObject } from "react";
import { LuFilePlus2 } from "react-icons/lu";

type UploadButtonProps = {
	openRef: RefObject<() => void>;
};

export const FileUpload: FC = memo(() => {
	const openRef = useRef<() => void>(null);
	const { states, upload } = useS3FileUpload();
	const [errContent, setErrContent] = useState<
		| {
				title: string;
				fileName: string;
				message: string;
		  }
		| undefined
	>(undefined);

	useEffect(() => {
		for (const [fileName, fileState] of Object.entries(states.files)) {
			if (fileState.error instanceof NoError) continue;

			setErrContent({
				title: fileState.error.title,
				fileName,
				message: fileState.error.message,
			});
		}
	}, [states.files]);

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
