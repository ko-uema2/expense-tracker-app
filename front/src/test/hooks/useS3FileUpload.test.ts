/**
 * @fileoverview Unit tests for the `useS3FileUpload` hook.
 * 
 * This file contains tests for the `useS3FileUpload` hook, which is responsible for handling file uploads to S3.
 * The tests cover the following scenarios:
 * - Verifying the properties of the hook's return object.
 * - Successful file upload to S3.
 * - Handling upload failures and setting appropriate error messages.
 * - Handling unknown errors and setting a generic error message.
 * - Handling missing `identityId` or `userSub` in the session.
 * 
 * Mocked dependencies:
 * - `aws-amplify/auth` for fetching the authentication session.
 * - `aws-amplify/storage` for uploading data to S3.
 * 
 * Mocked data:
 * - A UTF-8 encoded file content for testing file uploads.
 * 
 * @module useS3FileUpload.test
 */

import { renderHook, act } from "@testing-library/react";
import { useS3FileUpload } from "../../features/menu/hooks/useS3FileUpload";
import { FileWithPath } from "@mantine/dropzone";
import { fetchAuthSession } from "aws-amplify/auth";
import { uploadData } from "aws-amplify/storage";
import { TextEncoder } from "util";

jest.mock("aws-amplify/auth", () => ({
  fetchAuthSession: jest.fn(),
}));

jest.mock("aws-amplify/storage", () => ({
  uploadData: jest.fn(),
}));

// Mock the utf-8 file data for testing
const utf8Content = new TextEncoder().encode("file content");
const mockFile: FileWithPath = new File([utf8Content], "test.csv", {
  type: "text/csv",
});

// Mock the arrayBuffer method of the FileWithPath object
mockFile.arrayBuffer = jest.fn().mockResolvedValue(utf8Content.buffer);

describe("useS3FileUpload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test case: Verifying the properties of the hook's return object.
   * 
   * This test ensures that the `useS3FileUpload` hook returns an object with the correct properties.
   */
  test("should return an object with the correct properties", () => {
    const { result } = renderHook(() => useS3FileUpload());

    expect(result.current).toHaveProperty("errMsg");
    expect(result.current).toHaveProperty("loading");
    expect(result.current).toHaveProperty("handleUpload");
  });

  /**
   * Test case: Successful file upload to S3.
   * 
   * This test ensures that a file is successfully uploaded to S3 and the correct parameters are passed to the `uploadData` function.
   */
  test("should upload a file to S3 successfully", async () => {
    (fetchAuthSession as jest.Mock).mockResolvedValue({
      identityId: "test-identityId",
      userSub: "test-userSub",
    });
    (uploadData as jest.Mock).mockResolvedValue({
      key: mockFile.name,
    });

    const { result } = renderHook(() => useS3FileUpload());

    await act(async () => {
      await result.current.handleUpload(mockFile);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.errMsg).toBe("");
    expect(uploadData).toHaveBeenCalledWith({
      path: "private/test-identityId/test.csv",
      data: "file content",
      options: {
        metadata: { "user-id": "test-userSub" },
      },
    });
  });

  /**
   * Test case: Handling upload failures and setting appropriate error messages.
   * 
   * This test ensures that the hook sets an error message if the file upload fails.
   */
  test("should set an error message if the upload fails", async () => {
    (fetchAuthSession as jest.Mock).mockResolvedValue({
      identityId: "test-identityId",
      userSub: "test-userSub",
    });
    (uploadData as jest.Mock).mockRejectedValue(new Error("Upload failed"));

    const { result } = renderHook(() => useS3FileUpload());

    await act(async () => {
      await result.current.handleUpload(mockFile);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.errMsg).toBe("Upload failed");
  })

  /**
   * Test case: Handling unknown errors and setting a generic error message.
   * 
   * This test ensures that the hook sets a generic error message if an unknown error occurs during the file upload.
   */
  test("should set an error message if an unknown error occurs", async () => {
    (fetchAuthSession as jest.Mock).mockResolvedValue({
      identityId: "test-identityId",
      userSub: "test-userSub",
    });
    (uploadData as jest.Mock).mockRejectedValue({});

    const { result } = renderHook(() => useS3FileUpload());

    await act(async () => {
      await result.current.handleUpload(mockFile);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.errMsg).toBe("An error occurred. Please try again.");
  });

  /**
   * Test case: Handling missing `identityId` or `userSub` in the session.
   * 
   * This test ensures that the hook sets an error message if the session is missing `identityId` or `userSub`.
   */
  test("should set an error message if the session is missing identityId or userSub", async () => {
    (fetchAuthSession as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useS3FileUpload());

    await act(async () => {
      await result.current.handleUpload(mockFile);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.errMsg).toBe("No identityId or userSub found in session");
  });
});
