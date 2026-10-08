import type { Metadata } from "next";
import type { ReactNode } from "react";
import BillsVisual from "@/components/BillsVisual";
import FeatureChapter from "@/components/FeatureChapter";
import FeatureIndex from "@/components/FeatureIndex";
import GetApp from "@/components/GetApp";
import IdLookup from "@/components/IdLookup";
import KycTrack from "@/components/KycTrack";
import { History, Receive, Withdraw } from "@/components/MoreInApp";
import PageHero from "@/components/PageHero";
import WalletPhone from "@/components/WalletPhone";
import { actions } from "@/lib/actions";
import { chapters } from "@/lib/features";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Everything Blox does: a Naira and crypto wallet, instant sends by Blox ID, buying, selling and swapping with the numbers shown first, airtime and data, and a full history with alerts.",
  alternates: { canonical: "/features/" },
};

// Each chapter has a working picture of its subject on the other side of the text.
const visuals: Record<string, ReactNode> = {
  account: <KycTrack />,
  wallet: <WalletPhone />,
  send: (
    <>
      <IdLookup />
      <Receive />
    </>
  ),
  crypto: <Withdraw />,
  bills: <BillsVisual />,
  history: <History />,
};

export default function FeaturesPage() {
  return (
    <main id="main">
      <PageHero
        tone="ink"
        title="Everything Blox does."
        lead="Naira and crypto in one app: send, receive, buy, sell, swap and top up, with every number shown before you confirm."
        chips={[...actions.map((action) => action.label), "Blox ID"]}
      />

      <FeatureIndex items={chapters.map(({ id, label }) => ({ id, label }))} />

      {chapters.map((chapter, index) => (
        <FeatureChapter key={chapter.id} chapter={chapter} index={index}>
          {visuals[chapter.id]}
        </FeatureChapter>
      ))}

      <GetApp />
    </main>
  );
}
