import DashboardLayout from "@/layout/dashboard";
import { NextPageWithLayout } from "../_app";
import { ReactElement, useCallback } from "react";
import { W3iWidget, useManageView } from "@web3inbox/widget-react";
import "@web3inbox/widget-react/dist/compiled.css";
import { useAccount, useConnect, useSignMessage } from "wagmi";

const Chat: NextPageWithLayout = () => {
  const { open } = useManageView();
  open();
  const { signMessage } = useSignMessage();
  const { connect } = useConnect();
  return (
    // <W3iWidget
    //   account="eip155:1:0x710c8Fa06E9Ba9E2E4c75e30ac3e6fbD8A988550"
    //   projectId={process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? ""}
    //   onConnect={connect}
    //   onSign={(message) => {
    //     signMessage({ message });
    //   }}
    // />
    <>chat</>
  );
};

Chat.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Chat;
