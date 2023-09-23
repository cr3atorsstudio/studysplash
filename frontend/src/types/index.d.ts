import type { NextPage, NextPageWithLayout } from "next";
import type { AppProps } from "next/app";
import type { ReactElement } from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export interface INotification {
  title: string;
  body: string;
  icon: string;
  url: string;
  type: string;
}
