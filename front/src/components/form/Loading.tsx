import { FC, memo } from "react";

import { Loader, LoadingOverlay } from "@mantine/core";

type Props = {
  loading: boolean;
};

export const Loading: FC<Props> = memo(({ loading }) => {
  return (
    <LoadingOverlay
      visible={loading}
      loaderProps={<Loader className="h-6 w-6" variant="dots" />}
    />
  );
});

Loading.displayName = "Loading";
