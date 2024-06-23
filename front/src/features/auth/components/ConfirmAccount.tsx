import { Done, Undone } from "@/components/button";
import { Loading } from "@/components/form";
import { AppAlert } from "@/components/notification";
import { AppModalTitle } from "@/components/text";
import { AuthInfo } from "@/features/auth/types";
import { Group, Modal, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { confirmSignUp } from "aws-amplify/auth";
import { FormEvent, memo, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Props for the ConfirmAccount component.
 */
type ConfirmAccountProps = {
  opend: boolean;
  close: () => void;
  form: UseFormReturnType<AuthInfo, (values: AuthInfo) => AuthInfo>;
};

export const ConfirmAccount = memo(
  /**
   * ConfirmAccount component.
   *
   * @param {ConfirmAccountProps} props - Component props.
   * @returns {JSX.Element} ConfirmAccount component.
   */
  ({ opend, close, form }: ConfirmAccountProps) => {
    const nav = useNavigate();
    const [errMsg, setErrMsg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Handles form submission.
     *
     * @param {AuthInfo} values - Form values.
     * @param {FormEvent<HTMLFormElement>} event - Form event.
     * @returns {Promise<void>} Promise that resolves when form submission is complete.
     */
    const handleSubmit = async (
      values: AuthInfo,
      event: FormEvent<HTMLFormElement>
    ): Promise<void> => {
      event.preventDefault();
      setLoading(true);

      try {
        const response = await confirmSignUp({
          username: values.email,
          confirmationCode: values.confirmationCode!,
        });

        //TODO: display an error message if response is not successful

        console.log(response);

        setLoading(false);
        nav("/app");
      } catch (error: unknown) {
        setLoading(false);
        if (error instanceof Error) {
          setErrMsg(error.message);
        } else {
          setErrMsg("An error occurred. Please try again.");
        }
      }
    };

    return (
      <Modal
        centered
        opened={opend}
        onClose={close}
        title={
          <AppModalTitle
            label="Please enter confirmation code !"
            textColor="primary-700"
          />
        }
      >
        {errMsg && (
          <AppAlert
            title="Authorization Error"
            message={errMsg}
            onClick={() => setErrMsg("")}
          />
        )}

        <form
          onSubmit={form.onSubmit((values, event) =>
            handleSubmit(values, event!)
          )}
        >
          <Loading loading={loading} />
          <TextInput
            placeholder="Input here !"
            label="Confirmation Code"
            withAsterisk
            required
            {...form.getInputProps("confirmationCode")}
          />
          <Group className="mt-5" justify="flex-end">
            <Undone color="primary.7" label="Cancel" onClick={close} />
            <Done color="primary.7" type="submit" label="Confirm" />
          </Group>
        </form>
      </Modal>
    );
  }
);

ConfirmAccount.displayName = "ConfirmAccount";
