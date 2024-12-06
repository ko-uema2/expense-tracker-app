import { useState } from "react";

export const useS3FileUpload = () => {
  const [loading] = useState<boolean>(false);
  const [errMsg] = useState<string>("");

  /**
   * Handles the upload of selected files to AWS S3 storage.
   *
   * @param {FileWithPath[]} files - An array of files to be uploaded, where each file is represented by a `FileWithPath` object containing the file data and its path.
   * @returns {Promise<void>} A Promise that resolves when the upload is complete, or rejects with an error if the upload fails.
   */
  const handleUpload = async (): Promise<void> => {};

  return { loading, errMsg, handleUpload };
};
