import { useEffect } from "react";
import { RecoilRoot, atom, useSetRecoilState } from "recoil";
import { useAccount } from "wagmi";

type Props = {
  children: React.ReactElement | null;
};

export const globalStore = {
  userAddress: atom<string | undefined>({
    key: "global/userAddress",
    default: undefined,
  }),
  isConnected: atom<boolean>({
    key: "global/isConnected",
    default: false,
  }),
  isWalletConnectModalOpen: atom<boolean>({
    key: "global/isWalletConnectModalOpen",
    default: false,
  }),
  isConfirmModalOpen: atom<boolean>({
    key: "global/isConfirmModalOpen",
    default: false,
  }),
  isCardInfoModalOpen: atom<boolean>({
    key: "global/isCardInfoModalOpen",
    default: false,
  }),
  isLoading: atom<boolean>({
    key: "global/isLoading",
    default: false,
  }),
  isEth: atom<boolean>({
    key: "global/isEth",
    default: false,
  }),
  isVerifyModalOpen: atom<boolean>({
    key: "global/isVerifyModalOpen",
    default: false,
  }),
  proof: atom<string>({ key: "global/proof", default: "" }),
  hasNft: atom<boolean>({ key: "global/hasNft", default: true }),
  selectedMenu: atom<string>({
    key: "global/selectedMenu",
    default: "/dashboard",
  }),
};

const GlobalValuesWrapper = ({ children }: Props) => {
  const { address, isConnected } = useAccount();

  const setUserAddress = useSetRecoilState(globalStore.userAddress);
  const setIsConnected = useSetRecoilState(globalStore.isConnected);

  const setIsEth = useSetRecoilState(globalStore.isEth);

  useEffect(() => {
    setIsEth(Number(process.env.NEXT_PUBLIC_CHAIN_ID) === 5);
    setUserAddress(address);
    setIsConnected(isConnected);
  }, [address, isConnected, setIsConnected, setIsEth, setUserAddress]);

  return children;
};

export const GlobalStoreRoot = ({ children }: Props) => {
  return (
    <RecoilRoot>
      <GlobalValuesWrapper>{children}</GlobalValuesWrapper>
    </RecoilRoot>
  );
};
