import { FileWithPath } from "@mantine/dropzone";
import { fetchAuthSession } from "aws-amplify/auth";
import { uploadData } from "aws-amplify/storage";
import { useState } from "react";
import * as Encoding from "encoding-japanese";

export const useS3FileUpload = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

  /**
   * Handles the upload of selected files to AWS S3 storage.
   *
   * @param {FileWithPath} file - A file to be uploaded, where each file is represented by a `FileWithPath` object containing the file data and its path.
   * @returns {Promise<void>} A Promise that resolves when the upload is complete, or rejects with an error if the upload fails.
   */
  const handleUpload = async (file: FileWithPath): Promise<void> => {
    setLoading(true);

    try {
      // Fetch the current user's session
      const session = await fetchAuthSession();
      if (!session || !session.identityId || !session.userSub) {
        throw new Error("No identityId or userSub found in session");
      }

      // Read the content of the file as UTF-8 encoded text
      const fileContent = await readFileAsUTF8(file);

      // Upload the file to S3
      await uploadData({
        path: `private/${session.identityId}/${file.name}`,
        data: fileContent,
        options: {
          metadata: { "user-id": session.userSub },
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrMsg(error.message);
      } else {
        setErrMsg("An error occurred. Please try again.");
      }
    }

    setLoading(false);
  };

  return { loading, errMsg, handleUpload };
};

/**
 * Reads the content of a file and converts it to UTF-8 encoded text.
 *
 * @param {FileWithPath} file - The file to be read.
 * @returns {Promise<string>} A Promise that resolves with the UTF-8 encoded content of the file.
 */
const readFileAsUTF8 = async (file: FileWithPath): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  // detect encoding of the file
  const detectedEncoding = Encoding.detect(uint8Array);

  // convert the file content to UTF-8
  const utf8Array = Encoding.convert(uint8Array, {
    from: detectedEncoding as Encoding.Encoding,
    to: "UNICODE",
  });

  // convert the UTF-8 array to a string
  return Encoding.codeToString(utf8Array);

};