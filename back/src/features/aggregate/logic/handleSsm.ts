import { CATEGORY_LIST_KEY } from "@/features/aggregate/config/constant";
import { asyncFuncDecorator } from "@/features/aggregate/utils/funcDecorator";
import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";

/**
 * Class representing a handler for SSM (Systems Manager) operations.
 */
export class HandleSsm {
  #ssmClient: SSMClient;

  /**
   * Creates an instance of HandleSsm.
   */
  constructor() {
    this.#ssmClient = new SSMClient({});
  }

  /**
   * Retrieves parameters from SSM.
   * @returns A promise that resolves to an object containing the retrieved parameters.
   */
  @asyncFuncDecorator
  async getParameters(): Promise<{ [key: string]: string | undefined }> {
    const strResponse = await this.#ssmClient.send(
      new GetParameterCommand({
        Name: CATEGORY_LIST_KEY,
        WithDecryption: false,
      })
    );

    return {
      CATEGORY_LIST: strResponse.Parameter?.Value,
    };
  }
}
