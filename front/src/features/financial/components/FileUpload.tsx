import { Done } from "@/components/button";
import { FileInput } from "@mantine/core";
import { MIME_TYPES } from "@mantine/dropzone";
import { fetchAuthSession } from "aws-amplify/auth";
import { uploadData } from "aws-amplify/storage";
import { FC, FormEvent, memo, useState } from "react";

export const FileUpload: FC = memo(() => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (file: File | null) => {
    setFile(file);
  };

  const handleUpload = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (!file) return;

    setUploading(true);

    try {
      const session = await fetchAuthSession();
      if (!session || !session.identityId || !session.userSub) {
        throw new Error("No identityId or userSub found in session");
      }

      const res = await uploadData({
        path: `private/${session.identityId}/${file.name}`,
        data: file,
        options: {
          metadata: { "user-id": session.userSub },
          onProgress: (progress) => console.log(progress),
        },
      });
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleUpload}>
        <FileInput
          clearable
          accept={MIME_TYPES.csv}
          onChange={handleFileChange}
        />
        <Done color="primary.7" label="Upload" type="submit" />
      </form>
    </>
  );
});
