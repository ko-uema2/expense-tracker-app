const UNKNOWN_ERROR_MESSAGE = "想定外のエラーが発生しました。";
const APPLICATION_ERROR_MESSAGE = "アプリケーションエラーが発生しました。";
const S3_OBJECT_NOT_FOUND =
  "s3バケットから指定のファイルを取得できませんでした";
const IDENTITY_ID_NOT_FOUND =
  "オブジェクトキーからIdentityIdが見つかりませんでした";
const INVALID_DATE_FORMAT = "日付の形式が正しくありません";
const EXPENSE_DATA_ARRAY_EMPTY = "支出データ配列が空です";

const CATEGORY_LIST_KEY = process.env.CATEGORY_LIST;
const DYNAMO_DB_TABLE_NAME = process.env.DYNAMO_DB_TABLE_NAME;

export {
  UNKNOWN_ERROR_MESSAGE,
  APPLICATION_ERROR_MESSAGE,
  S3_OBJECT_NOT_FOUND,
  CATEGORY_LIST_KEY,
  DYNAMO_DB_TABLE_NAME,
  IDENTITY_ID_NOT_FOUND,
  INVALID_DATE_FORMAT,
  EXPENSE_DATA_ARRAY_EMPTY,
};
