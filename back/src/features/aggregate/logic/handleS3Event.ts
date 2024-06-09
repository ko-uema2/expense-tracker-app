import {
  IDENTITY_ID_NOT_FOUND,
  S3_OBJECT_NOT_FOUND,
} from "@/features/aggregate/config/constant";
import { CustomLogger } from "@/features/aggregate/utils/customLogger";
import {
  asyncFuncDecorator,
  syncFuncDecorator,
} from "@/features/aggregate/utils/funcDecorator";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { S3Event } from "aws-lambda";

const logger = new CustomLogger();

/**
 * Class responsible for extracting information from an S3 event.
 */
export class HandleS3Event {
  #s3Client: S3Client;
  #event: S3Event;

  /**
   * Constructs a new instance of the S3EventExtractor class.
   * @param event - The S3 event object.
   */
  constructor(event: S3Event) {
    this.#s3Client = new S3Client({});
    this.#event = event;
  }

  /**
   * Retrieves the contents of a CSV file from S3.
   * @returns A promise that resolves to a Uint8Array containing the CSV file contents.
   * @throws An error if the S3 object is not found.
   */
  @asyncFuncDecorator
  async getObjContent(): Promise<{
    shiftJISByteArray: Uint8Array;
    userId: string;
  }> {
    // Extract the bucket name and key from the event
    const bucket = this.#event.Records[0].s3.bucket.name;
    // Decode the key as it may contain URL-encoded multibyte characters
    logger.debug(`key: ${this.#event.Records[0].s3.object.key}`);
    const decodedKey = decodeURIComponent(this.#event.Records[0].s3.object.key);

    logger.debug(decodedKey);

    // Retrieve the file from S3
    const res = await this.#s3Client.send(
      new GetObjectCommand({ Bucket: bucket, Key: decodedKey })
    );
    // Get the file as a Shift-JIS byte array from the response
    const shiftJISByteArray = await res.Body?.transformToByteArray();
    const userId = res.Metadata?.["user-id"];
    if (!shiftJISByteArray) {
      throw new Error(S3_OBJECT_NOT_FOUND);
    }

    return { shiftJISByteArray, userId: userId ?? "" };
  }
}
