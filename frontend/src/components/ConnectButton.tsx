import { IconButton } from "@chakra-ui/react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
interface Props {
  isConnected: boolean;
  label: string;
}

const ConnectButton = ({ isConnected, label }: Props) => {
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
          {/* <Link href={"/dashboard"}>
            <Button
              rounded={"full"}
              size={{ md: "md", base: "xs" }}
              py={4}
              colorScheme="purple"
            >
              Launch app
            </Button>
          </Link> */}
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
