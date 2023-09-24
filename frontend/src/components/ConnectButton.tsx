import { IconButton } from "@chakra-ui/react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
interface Props {
  isConnected: boolean;
}

const ConnectButton = ({ isConnected }: Props) => {
  const { open } = useWeb3Modal();
  return (
    <>
      {isConnected ? (
        <>
          <IconButton
            rounded={"full"}
            bg={"brand.student"}
            aria-label={"wallet button"}
            icon={
              <AccountBalanceWalletOutlinedIcon
                style={{
                  color: "#fff",
                }}
              />
            }
            onClick={() => open({ view: "Account" })}
            mx={3}
          />
        </>
      ) : (
        <IconButton
          aria-label={"wallet connect button"}
          rounded={"full"}
          bg={"brand.student"}
          onClick={() => open({ view: "Connect" })}
          icon={
            <AccountBalanceWalletOutlinedIcon
              style={{
                color: "#fff",
              }}
            />
          }
        />
      )}
    </>
  );
};

export default ConnectButton;
