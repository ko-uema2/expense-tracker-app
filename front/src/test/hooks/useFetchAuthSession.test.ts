import { useFetchAuthSession } from "@/hooks/useFetchAuthSession";
import { GeneralException } from "@/utils/error/const";
import { GeneralError, NoError, UnknownError } from "@/utils/error/error";
import { act, renderHook } from "@testing-library/react";
import * as AmplifyAuth from "aws-amplify/auth";

// モック用のAuthSession型
const mockSession: AmplifyAuth.AuthSession = {
	tokens: {
		idToken: { payload: { exp: Math.floor(Date.now() / 1000) + 3600 } },
		accessToken: { payload: { exp: Math.floor(Date.now() / 1000) + 3600 } },
	},
};

describe("useFetchAuthSession", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test("正常系: セッション取得成功", async () => {
		jest
			.spyOn(AmplifyAuth, "fetchAuthSession")
			.mockResolvedValueOnce(mockSession);
		const expectedError = new NoError();

		const { result } = renderHook(() => useFetchAuthSession());
		await act(async () => {
			await result.current.fetchAuthSession();
		});

		expect(result.current.session).toEqual(mockSession);
		expect(result.current.error).toEqual(expectedError);
	});

	test("異常系: リフレッシュトークンが期限切れの場合はGeneralError", async () => {
		jest
			.spyOn(AmplifyAuth, "fetchAuthSession")
			.mockRejectedValueOnce(
				Object.assign(new Error("Refresh Token has expired"), {
					code: "NotAuthorizedException",
				}),
			);
		const expectedError = new GeneralError(
			GeneralException.NotAuthorizedException,
		);

		const { result } = renderHook(() => useFetchAuthSession());
		await act(async () => {
			await result.current.fetchAuthSession();
		});

		expect(result.current.session).toBeNull();
		expect(result.current.error).toEqual(expectedError);
	});

	test("異常系: fetchAuthSessionが想定外の例外を投げた場合はUnknownError", async () => {
		jest
			.spyOn(AmplifyAuth, "fetchAuthSession")
			.mockRejectedValueOnce(new Error("unknown"));
		const expectedError = new UnknownError();

		const { result } = renderHook(() => useFetchAuthSession());
		await act(async () => {
			await result.current.fetchAuthSession();
		});

		expect(result.current.session).toBeNull();
		expect(result.current.error).toEqual(expectedError);
	});
});
