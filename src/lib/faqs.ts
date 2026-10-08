// Help answers. They only repeat what the feature list says. Anything about limits, fees, timings,
// licences or contact details is left out until the client confirms it (see docs/client-questions.md).

export const topics = [
  "Account",
  "Security",
  "Wallet",
  "Sending",
  "Crypto",
  "Bills",
  "History",
] as const;

export type Topic = (typeof topics)[number];

export type Faq = { id: string; topic: Topic; q: string; a: string };

export const faqs: Faq[] = [
  {
    id: "blox-id",
    topic: "Account",
    q: "What is a Blox ID?",
    a: "Every Blox account has its own unique eight-digit Blox ID. You can copy it and share it, and it is all someone needs to send you money.",
  },
  {
    id: "kyc",
    topic: "Account",
    q: "How do I verify my account?",
    a: "After you sign up, you verify your identity (KYC). Your status shows in the app as pending, approved or rejected.",
  },
  {
    id: "kyc-status",
    topic: "Account",
    q: "What do pending, approved and rejected mean?",
    a: "Pending means your details are still being reviewed. Approved means your account is verified. Rejected means your details were not accepted.",
  },
  {
    id: "secure",
    topic: "Security",
    q: "How is my account protected?",
    a: "Your identity is verified when you sign up, and your account is protected by a transaction PIN, biometrics and one-time codes (OTP / 2FA).",
  },
  {
    id: "pin",
    topic: "Security",
    q: "What is the transaction PIN for?",
    a: "You set a PIN of your own and enter it to confirm sensitive actions, such as a withdrawal.",
  },
  {
    id: "biometrics",
    topic: "Security",
    q: "Can I unlock Blox with my fingerprint or face?",
    a: "Yes. Blox supports biometrics, so you can unlock with them. Which kind you can use depends on your phone.",
  },
  {
    id: "wallet",
    topic: "Wallet",
    q: "What can I hold in my wallet?",
    a: "A Naira balance and several crypto assets, together in one place.",
  },
  {
    id: "home",
    topic: "Wallet",
    q: "What can I do from the home screen?",
    a: "You see your balances and recent transactions, and the quick actions: Buy, Sell, Send, Receive, Swap, Airtime and Data.",
  },
  {
    id: "send-blox",
    topic: "Sending",
    q: "How do I send money to another Blox user?",
    a: "Enter their eight-digit Blox ID. Their verified name appears so you can check it is the right person, then you confirm. The money arrives instantly, a reference is generated and you are both notified.",
  },
  {
    id: "name-check",
    topic: "Sending",
    q: "Why does Blox show me a name before I send?",
    a: "So you can check you have the right person. If you mistype an ID, the name will not match who you meant to pay.",
  },
  {
    id: "send-outside",
    topic: "Sending",
    q: "How do I send crypto to an address outside Blox?",
    a: "Choose the asset and the network, enter the address, check the network fee, and confirm with your PIN.",
  },
  {
    id: "receive",
    topic: "Sending",
    q: "How do I receive money?",
    a: "Share or copy your Blox ID. To receive crypto, use the address shown with its QR code, and read the network warning so you send on the right network.",
  },
  {
    id: "trade",
    topic: "Crypto",
    q: "How do buying, selling and swapping work?",
    a: "You can buy crypto with Naira, sell it back to Naira, or swap one asset for another. Each time, the rate, the fees and the amount you will get are shown before you confirm.",
  },
  {
    id: "deposit",
    topic: "Crypto",
    q: "Why is my deposit pending?",
    a: "A deposit shows as pending until it is confirmed on the network.",
  },
  {
    id: "withdrawal-status",
    topic: "Crypto",
    q: "What do the withdrawal statuses mean?",
    a: "Pending means it is waiting to start, and processing means it is being sent. Completed means it went through. Failed means it did not go through, and cancelled means it was stopped.",
  },
  {
    id: "bills",
    topic: "Bills",
    q: "Can I buy airtime and data?",
    a: "Yes. You can buy airtime and data for Nigerian networks from the app, using your balance.",
  },
  {
    id: "history",
    topic: "History",
    q: "Where can I see my past transactions?",
    a: "In your transaction history. You can search it and filter it to find what you need.",
  },
  {
    id: "notify",
    topic: "History",
    q: "Will I be told when something happens?",
    a: "Yes. You get notifications for transactions and whenever a status changes. For a Blox to Blox transfer, both people are notified.",
  },
];
