"use client";

import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  useBreakpointValue,
  Button,
} from "@chakra-ui/react";
import { FiHome, FiMenu } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi";
import { BsPersonCircle, BsFillChatDotsFill } from "react-icons/bs";
import { IconType } from "react-icons";
import { M_PLUS_1_bold } from "./Header";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import { globalStore } from "@/store/global";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import {
  useInitWeb3InboxClient,
  useManageSubscription,
  useW3iAccount,
} from "@web3inbox/widget-react";

import { useAccount, usePublicClient, useSignMessage } from "wagmi";
import useSendNotification from "@/hooks/useSendNotification";
interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
  href: string;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Dashboard", icon: FiHome, href: "/dashboard" },
  { name: "Your group", icon: HiUserGroup, href: "/group" },
  { name: "Profile", icon: BsPersonCircle, href: "/profile" },
  { name: "Chat", icon: BsFillChatDotsFill, href: "/chat" },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const {
    account,
    setAccount,
    register: registerIdentity,
    identityKey,
  } = useW3iAccount();
  const { subscribe, unsubscribe, isSubscribed } = useManageSubscription({
    account,
  });

  const { handleSendNotification, isSending } = useSendNotification();

  const isW3iInitialized = useInitWeb3InboxClient({
    projectId,
    domain: appDomain,
  });

  const handleTestNotification = useCallback(async () => {
    if (isSubscribed) {
      handleSendNotification({
        title: "GM Hacker",
        body: "Hack it until you make it!",
        icon: `${window.location.origin}/WalletConnect-blue.svg`,
        url: window.location.origin,
        type: "promotional",
      });
    }
  }, [handleSendNotification, isSubscribed]);

  const { address } = useAccount({
    onDisconnect: () => {
      setAccount("");
    },
  });
  return (
    <Box
      transition="3s ease"
      bg={"brand.student"}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      mt={"80px"}
      {...rest}
      roundedTopRight={"32px"}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} href={link.href}>
          {link.name}
        </NavItem>
      ))}
      <Button onClick={subscribe}>Subscribe</Button>
    </Box>
  );
};

const NavItem = ({ icon, children, href, ...rest }: NavItemProps) => {
  const selectedMenu = useRecoilValue(globalStore.selectedMenu);
  const setSelectedMenu = useSetRecoilState(globalStore.selectedMenu);
  const router = useRouter();

  const onMenuItemClick = useCallback(() => {
    setSelectedMenu(href);
  }, []);

  useEffect(() => {
    setSelectedMenu(router.pathname);
  }, []);

  return (
    <Link
      href={href}
      onClick={onMenuItemClick}
      style={{
        textDecoration: "none",
      }}
    >
      <Flex
        align="center"
        p="2"
        m="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        color={"white"}
        {...rest}
        fontWeight={500}
        fontSize={"lg"}
        bg={selectedMenu === href ? "#403f3e66" : "transparent"}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
}
const MobileNav = ({ onOpen, onClose, isOpen }: MobileProps) => {
  const onClickMenu = useCallback(() => {
    isOpen ? onClose() : onOpen();
  }, [onOpen, isOpen]);

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 2, md: 4 }}
      h="60px"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      pos={"fixed"}
      top={0}
      left={0}
      zIndex={999999}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onClickMenu}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
        zIndex={999999}
        alignItems={"center"}
      />
    </Flex>
  );
};

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;
const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN as string;

const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box w={"200px"}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement={"left"}
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size={{ md: "full", base: "xs" }}
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>

      {/* mobilenav */}
      <MobileNav
        display={{ base: "flex", md: "none" }}
        onOpen={onOpen}
        onClose={onClose}
        isOpen={isOpen}
      />
    </Box>
  );
};

export default Sidebar;
