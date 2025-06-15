# ❓ 独自エラークラスを追加したいときのFAQ

## Q. 新しいドメイン固有のエラークラス（例: `StorageError`）を追加したいのですが、どうすればよいですか？

### ✅ ステップ1: エラー種別を定義する

まずはエラーの種別を列挙体として定義します。

```typescript:feature/your-feature/error/const.ts
export enum FileUploadException {
  NoCredentials: "NoCredentials",
  ObjectIsTooLarge: "ObjectIsTooLarge",
  UploadFailed: "UploadFailed",
  // 必要に応じて追加
}
```

### ✅ ステップ2: エラー種別ごとのプロパティを定義する

次に、エラー種別ごとにプロパティを定義します。ここでは、`FileUploadException`を例にしています。

```typescript:feature/your-feature/error/const.ts
export const FILE_UPLOAD_ERROR = {
  [FileUploadException.NoCredentials]: {
    title: "認証エラー",
    message: "認証情報がありません。ログインしてください。",
    errorCode: FileUploadException.NoCredentials,
    level: "error",
  },
  [FileUploadException.ObjectIsTooLarge]: {
    title: "オブジェクトサイズエラー",
    message: "アップロードするオブジェクトが大きすぎます。",
    errorCode: FileUploadException.ObjectIsTooLarge,
    level: "error",
  },
  [FileUploadException.UploadFailed]: {
    title: "アップロード失敗",
    message: "アップロードに失敗しました。",
    errorCode: FileUploadException.UploadFailed,
    level: "error",
  },
  // 必要に応じて追加
};
```

### ✅ ステップ3: 複数のエラー定義を統合して全体エラー定義を作成する

ファイルアップロードやダウンロードなど、複数の機能ごとにエラー定義オブジェクト（例: `FILE_UPLOAD_ERROR`, `FILE_DOWNLOAD_ERROR`）を作成することを想定し、
それらを`...`スプレッド構文でまとめて一つの大きなエラー定義オブジェクト（例: `STORAGE_ERROR`）としてエクスポートする。

```typescript:feature/your-feature/error/const.ts
export const STORAGE_ERROR = {
  ...FILE_UPLOAD_ERROR,
  // 必要に応じて追加
} as const;
```

これにより、全体のエラー定義を一元管理でき、エラーコードから詳細情報を簡単に取得できるようになる。

### ✅ ステップ4: 全体エラー定義からエラーコードで詳細情報を取得できるマッピングを作成する

`STORAGE_ERROR`からエラーコードをキーに詳細情報を取得できるマッピング（例: `storageErrorDefinition`）を作成する。

```typescript:feature/your-feature/error/const.ts

export const storageErrorDefinition = Object.fromEntries(
  Object.entries(STORAGE_ERROR).map(([, value]) => [value.errorCode, value]),
) as Record<StorageException, ErrorDefinition<StorageException>>;
```

#### ✅ ステップ5: 例外の型を定義する

```typescript:feature/your-feature/error/type.d.ts
export type StorageException = FileUploadException;  // 必要に応じて他Exceptionを追加
```

### ✅ ステップ6: エラークラスを定義する

実際にアプリケーションでthrow/catchするための独自エラークラス（例: `StorageError`）を定義します。

- ここで定義するクラスは、上記で作成したエラー定義マッピング（`storageErrorDefinition`）を利用し、エラーコードからタイトル・メッセージ・レベルなどを取得して親クラスに渡す。
- これにより、UIやロギングで一貫したエラー情報を扱うことができ、catch時に`instanceof StorageError`で判定も可能になる。

```typescript:feature/your-feature/error/error.ts
import { storageErrorDefinition } from "./const";
import { ErrorDefinition } from "@/types/error";
import { StorageException } from "./type";

export class StorageError extends AppError {
  constructor(code: StorageException) {
    const errorDefinition = storageErrorDefinition[code];
    // set default error message if errorDefinition is not found
    if (!errorDefinition) {
      throw new UnknownError();
    }

    const { title, message, errorCode, level } = errorDefinition;

    // set error message
    super(title, message, errorCode, level);

    this.name = "StorageError";
  }
}
```
