import { ActionIcon, Burger, Group, Menu, Title } from "@mantine/core";
import { signOut } from "aws-amplify/auth";
import { FC, memo } from "react";
import React from "react";
import { BsBoxArrowLeft } from "react-icons/bs";
import { LuSettings, LuSettings2 } from "react-icons/lu";

type Props = {
  opened: boolean;
  toggle: () => void;
};

export const Header: FC<Props> = memo((props) => {
  const { opened, toggle } = props;

  const handleSignout = async () => {
    try {
      await signOut({ global: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return (
    <Group className="h-full px-2 justify-between">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Title className="text-primary-700" order={2}>
        Expense Tracker
      </Title>
      <Menu>
        <Menu.Target>
          <ActionIcon
            className="w-10 h-10 mr-3"
            variant="subtle"
            color="base.8"
          >
            <LuSettings size={25} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Account</Menu.Label>
          <Menu.Item leftSection={<LuSettings2 size={14} />} disabled>
            Settings
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={<BsBoxArrowLeft size={14} />}
            onClick={handleSignout}
          >
            Sign Out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
});

Header.displayName = "Header";
