import { Container, Image, SimpleGrid, Text, Title } from "@mantine/core";
import { FC, memo } from "react";
import image from "@/assets/undraw_server_down_s-4-lk.svg";
import { Done } from "@/components/button";

export const Error500WithinPrivateRoute: FC = memo(() => {
  return (
    <Container className="py-20">
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Image className="block md:hidden" src={image} />
        <div>
          <Title className="font-bold text-4xl md:text¥[2.125rem] mb-4">
            問題が発生したようです
          </Title>
          <Text className="text-lg text-base-500">
            ご利用中に問題が発生しました。
            <br />
            お手数ですが、以下「トップページへ戻る」ボタンをクリックいただき、もう一度最初から再操作をお試しください。
            <br />
            再度問題が発生する場合は、お手数ですがお問い合わせフォームよりお知らせください。
          </Text>
          <Done
            className="mt-6 w-full md:w-auto"
            color="primary.7"
            label="トップページへ戻る"
            type="button"
          />
        </div>
        <Image className="hidden md:block" src={image} />
      </SimpleGrid>
    </Container>
  );
});

export const Error500WithinPubliceRoute: FC = memo(() => {
  return (
    <Container className="py-20">
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Image className="block md:hidden" src={image} />
        <div>
          <Title className="font-bold text-4xl md:text¥[2.125rem] mb-4">
            問題が発生したようです
          </Title>
          <Text className="text-lg text-base-500">
            ご利用中に問題が発生しました。
            <br />
            お手数ですが、以下「トップページへ戻る」ボタンをクリックいただき、もう一度最初から再操作をお試しください。
            <br />
            再度問題が発生する場合は、お手数ですがお問い合わせフォームよりお知らせください。
          </Text>
          <Done
            className="mt-6 w-full md:w-auto"
            color="primary.7"
            label="トップページへ戻る"
            type="button"
          />
        </div>
        <Image className="hidden md:block" src={image} />
      </SimpleGrid>
    </Container>
  );
});

Error500WithinPubliceRoute.displayName = "Error500WithinPublicRoute";
Error500WithinPrivateRoute.displayName = "Error500WithinPrivateRoute";
