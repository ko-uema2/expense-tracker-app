import { Button } from "@mantine/core";
import { Dropzone, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { fetchAuthSession } from "aws-amplify/auth";
import { uploadData, UploadDataWithPathOutput } from "aws-amplify/storage";
import { LuFilePlus2 } from "react-icons/lu";
import { FC, RefObject, memo, useRef, useState } from "react";
import React from "react";

type UploadButtonProps = {
  openRef: RefObject<() => void>;
};

export const FileUpload: FC = memo(() => {
  const openRef = useRef<() => void>(null);
  const [errMsg, setErrMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Handles the upload of selected files to AWS S3 storage.
   *
   * @param {FileWithPath[]} files - An array of files to be uploaded, where each file is represented by a `FileWithPath` object containing the file data and its path.
   * @returns {Promise<void>} A Promise that resolves when the upload is complete, or rejects with an error if the upload fails.
   */
  const handleUpload = async (files: FileWithPath[]): Promise<void> => {
    setLoading(true);
    const file = files[0];
    const result = {
      data: null as UploadDataWithPathOutput | null,
      error: null as Error | null,
    };

    try {
      const session = await fetchAuthSession();
      if (!session || !session.identityId || !session.userSub) {
        throw new Error("No identityId or userSub found in session");
      }

      // TODO: implement the ability to upload multiple files
      result.data = await uploadData({
        path: `private/${session.identityId}/${file.name}`,
        data: file,
        options: {
          metadata: { "user-id": session.userSub },
          onProgress: (progress) => console.log(progress),
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        result.error = error;
      } else {
        result.error = new Error("An error occurred. Please try again.");
      }
    }

    setLoading(false);

    if (result.error !== null) {
      setErrMsg(result.error.message);
    }
  };

  return (
    <>
      <Dropzone
        openRef={openRef}
        onDrop={handleUpload}
        accept={[MIME_TYPES.csv]}
      ></Dropzone>
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
