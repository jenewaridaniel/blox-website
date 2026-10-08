// What Blox does, chapter by chapter. Every line comes from the product's feature list; nothing here
// promises a limit, a fee or a time that the list does not state.

export type Feature = { title: string; text: string };

export type Chapter = {
  id: string;
  label: string;
  title: string;
  lead: string;
  tone: "violet" | "ink" | "deep";
  features: Feature[];
};

export const chapters: Chapter[] = [
  {
    id: "account",
    label: "Account",
    title: "One account, checked and protected.",
    lead: "Sign up, verify who you are, and get a Blox ID of your own.",
    tone: "violet",
    features: [
      {
        title: "Sign up and log in",
        text: "Create your account and log in, with one-time codes (OTP / 2FA) for extra safety.",
      },
      {
        title: "Identity check (KYC)",
        text: "Verify your identity once. Your status shows in the app as pending, approved or rejected.",
      },
      {
        title: "Your own Blox ID",
        text: "Every user gets a unique eight-digit Blox ID to copy and share. It is what people use to send you money.",
      },
      {
        title: "PIN and biometrics",
        text: "Set a transaction PIN, and use biometrics to unlock.",
      },
    ],
  },
  {
    id: "wallet",
    label: "Wallet",
    title: "Naira and crypto, side by side.",
    lead: "Everything you hold, and everything you can do with it, on one screen.",
    tone: "ink",
    features: [
      {
        title: "One wallet, many assets",
        text: "A Naira balance and several crypto assets, together in one place.",
      },
      {
        title: "A dashboard that tells you where you stand",
        text: "Your balances, your recent transactions and your quick actions, all on the home screen.",
      },
      {
        title: "Seven quick actions",
        text: "Buy, Sell, Send, Receive, Swap, Airtime and Data, each one tap from home.",
      },
    ],
  },
  {
    id: "send",
    label: "Send and receive",
    title: "Send to a number. Know who gets it.",
    lead: "Blox to Blox transfers use an eight-digit ID, and show you the person before you confirm.",
    tone: "deep",
    features: [
      {
        title: "Blox to Blox, by ID",
        text: "Enter a Blox ID and the money arrives instantly.",
      },
      {
        title: "See the name first",
        text: "The recipient's verified name shows before you confirm, so you know who you are paying.",
      },
      {
        title: "A reference and a notification",
        text: "Every transfer gets a reference, and both people are notified.",
      },
      {
        title: "All or nothing",
        text: "A transfer either goes through in full or not at all.",
      },
      {
        title: "To an outside address",
        text: "Send crypto to an external address by choosing the asset and the network.",
      },
      {
        title: "Receive your way",
        text: "Share or copy your Blox ID, or use a crypto address with its QR code and a clear network warning.",
      },
    ],
  },
  {
    id: "crypto",
    label: "Crypto",
    title: "Buy, sell and swap with the numbers in front of you.",
    lead: "You see the rate, the fees and what you will get before anything happens.",
    tone: "violet",
    features: [
      {
        title: "Buy and sell with Naira",
        text: "Buy crypto with Naira, or sell it back. The rate, the fees and the amount you will get show before you confirm.",
      },
      {
        title: "Swap one asset for another",
        text: "Swaps show the same three things first: the rate, the fees and the amount you will get.",
      },
      {
        title: "Deposits",
        text: "A deposit shows as pending until it is confirmed on the network.",
      },
      {
        title: "Withdrawals",
        text: "Pick the asset and the network, enter the address, see the network fee, and confirm with your PIN.",
      },
      {
        title: "Clear statuses",
        text: "A withdrawal moves through pending, processing and completed, or ends as failed or cancelled.",
      },
    ],
  },
  {
    id: "bills",
    label: "Bills",
    title: "Top up without leaving the app.",
    lead: "Airtime and data for the networks you already use.",
    tone: "ink",
    features: [
      {
        title: "Airtime",
        text: "Top up airtime for Nigerian networks, straight from the app.",
      },
      {
        title: "Data",
        text: "Buy data for Nigerian networks, right next to your Naira and crypto.",
      },
    ],
  },
  {
    id: "history",
    label: "History and alerts",
    title: "A record of everything, and a nudge when it changes.",
    lead: "Look anything up later, and hear about it the moment it happens.",
    tone: "deep",
    features: [
      {
        title: "Search your history",
        text: "Every transaction is in one list you can search.",
      },
      {
        title: "Filter it",
        text: "Narrow the list down to just what you are looking for.",
      },
      {
        title: "Notifications",
        text: "Get a notification for transactions and whenever a status changes.",
      },
    ],
  },
];
