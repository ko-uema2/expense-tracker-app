import { renderHook } from "@testing-library/react";
import { useS3FileUpload } from "../../features/menu/hooks/useS3FileUpload";

describe("useS3FileUpload", () => {
  it("should return an object with the correct properties", () => {
    const { result } = renderHook(() => useS3FileUpload());

    expect(result.current).toHaveProperty("errMsg");
    expect(result.current).toHaveProperty("loading");
    expect(result.current).toHaveProperty("handleUpload");
  });
});
