# Questions for the client

Answers we need to finish the Blox website. **A** questions block the build or make something on the site false if guessed. **B** can wait until closer to launch.

Everything on the site that is currently a guess is listed here, so nothing invented ships by accident.

## 1. Rates and fees (the Buy, Sell, Swap card)

|     | Question                                                                                                                                                                  | Why we ask                                                                                                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| A   | How does Blox set its **buy rate** and **sell rate**? A percentage above and below the market price, or rates you set by hand? What are the numbers?                      | The site shows an "indicative" market price from CoinGecko. Real buy and sell rates differ from it, and the site must not suggest otherwise. |
| A   | What are the **fees**? Flat amount, percentage, or both, and are they the same for Buy, Sell, Swap, withdrawals and sending to an external address? Is Blox to Blox free? | The fees on the card (₦500, 2 USDT) are made up.                                                                                             |
| A   | Will the Blox backend publish its own **rates endpoint** (buy rate, sell rate, fees, updated time) that the website can call? Who builds it and in what language?         | It lets the website and the app always show the same numbers, and replaces CoinGecko on the site.                                            |
| B   | How long is a quoted rate **held** once a user sees it (for example 30 seconds)?                                                                                          | It lets the card say what the app really does.                                                                                               |

## 2. What Blox supports

|     | Question                                                                                                                                                                                                 | Why we ask                                                      |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| A   | Which **crypto assets** at launch, and on which **networks** (for example USDT on TRC20, ERC20, BEP20)?                                                                                                  | The card shows USDT and BTC only because we guessed.            |
| A   | How do users **add Naira** (bank transfer, a dedicated account number, card) and **withdraw Naira** to a bank? How long does each take?                                                                  | The site shouldn't promise anything we can't describe.          |
| B   | What are the **limits** (minimum, maximum, daily) and how do the **KYC levels** change them?                                                                                                             | Likely belongs in the Fees and Help pages.                      |
| A   | **Airtime and data:** which networks (MTN, Airtel, Glo, 9mobile)? Does the money come from the **Naira balance**? Is there any **discount or cashback**, or is it face value? Which bundles are offered? | The Airtime and Data section shows example amounts and bundles. |
| B   | Is there **Naira to crypto to bank** in one step, or are they separate actions?                                                                                                                          | Affects how we describe the flow.                               |

## 3. The Blox ID

|     | Question                                                                                                            | Why we ask                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| A   | Is the Blox ID always **eight digits**? Can a user change it? Is it ever reused?                                    | The site says "Eight digits. That's all it takes to send."                                                       |
| A   | When someone types an ID, is the recipient's **full name** shown, or a partly hidden one (for example "Adaeze O.")? | Showing full names to anyone who guesses an ID is a privacy risk, and the site demo currently shows a full name. |
| B   | Are there **limits or protections** against guessing IDs?                                                           | Could be a security point worth stating.                                                                         |

## 4. Trust, legal and compliance

|     | Question                                                                                                                                                       | Why we ask                                                                              |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| A   | What is the **registered company name, RC number and address**?                                                                                                | Needed in the footer and legal pages.                                                   |
| A   | Does Blox hold any **licence or registration** (for example with the SEC or CBN), or is it applied for? **What may the website say about it?**                 | Words like "licensed" or "regulated" must be true. We won't write them until confirmed. |
| A   | Which **security features are actually live** at launch: transaction PIN, biometrics, OTP / 2FA? Anything else (for example cold storage of funds, insurance)? | The Security page can only list what exists.                                            |
| A   | Who writes the **Terms, Privacy Policy and crypto risk warning**, and when will we have them?                                                                  | Required before launch, and we need to link them.                                       |
| B   | Cookie and analytics approach (which tool, and does it need a consent banner)?                                                                                 | Data protection rules in Nigeria.                                                       |

## 5. Brand and assets

|     | Question                                                                                                 | Why we ask                                                                          |
| --- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| A   | Can we have the **v5 brand kit** files: logo (SVG), favicon, app icon, fonts?                            | The site currently uses a typed "blox" wordmark and the Gabarito font as stand-ins. |
| A   | Can we use **MTN, Airtel, Glo and 9mobile logos**, or do we use plain names?                             | Their logos are trademarked, so we use plain names unless permission is confirmed.  |
| A   | Who are the **people in the photos**? Do we have **photography we own** or stock we are licensed to use? | The hero uses a free stock photo as a placeholder.                                  |
| B   | Is the tagline "**Naira and crypto. One simple app.**" final?                                            | It's in the page title and across the site.                                         |

## 6. Launch and the app

|     | Question                                                                                                                       | Why we ask                                              |
| --- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| A   | Is the app **live**, or is this a **waitlist**? If waitlist, where do sign-ups go (an email tool, a spreadsheet, the backend)? | Decides what "Get the app" does.                        |
| A   | **App Store and Google Play links**, and the launch date.                                                                      | The main call to action.                                |
| A   | The final **website address** (we assumed blox.ng) and who controls the domain and hosting.                                    | Used in the sitemap, share links and search listings.   |
| B   | A **support email, phone or WhatsApp**, and support hours.                                                                     | For the Help page and footer.                           |
| B   | **Social links** (Instagram, X, LinkedIn, and so on).                                                                          | Footer.                                                 |
| B   | Any **real numbers, partners or press** we may show (users, volume, backers)?                                                  | We only show things that are true and can be backed up. |

## 7. Content

|     | Question                                                         | Why we ask                |
| --- | ---------------------------------------------------------------- | ------------------------- |
| B   | Who writes the **Help / FAQ** content?                           | Needed for the Help page. |
| B   | Is the site **English only**, or also Pidgin or other languages? | Changes how we build it.  |

## 8. Wallet, receiving, withdrawing and history (the new home page sections)

These sections show the whole of what the app does. Everything on them is an example, so each needs checking against the real product.

|     | Question                                                                                                                                                                                         | Why we ask                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| A   | **Withdrawals:** is it really asset, then network, then address, then network fee, then PIN, in that order? Are the five statuses exactly **pending, processing, completed, failed, cancelled**? | The Withdraw card walks through these steps and statuses.                                 |
| A   | **Deposits:** do they show as **pending until the network confirms** them? Is there a number of confirmations we can state?                                                                      | The card says deposits show as pending.                                                   |
| A   | **Receiving crypto:** is there a **QR code** per address, and a **warning about the network**? What exactly does the warning say?                                                                | The Receive card shows a QR-shaped picture (it is not a real code) and a general warning. |
| A   | Does the app show **notifications for every transaction and status change**? Push, in-app, or both?                                                                                              | The History card says so.                                                                 |
| A   | Is **search and filter** in transaction history live at launch, and what can people filter by?                                                                                                   | We assumed Sent, Received, Crypto and Bills.                                              |
| B   | What does the **home screen** really show? Is there a Naira balance, several crypto balances and recent transactions, in that order?                                                             | The phone picture in "Get the app" is made up from your feature list.                     |
| B   | Does **biometric unlock** mean fingerprint, face, or whichever the phone has?                                                                                                                    | The Security card shows a fingerprint sensor.                                             |
| A   | Is **selling USDT for Naira and then sending that Naira to a Blox ID** a flow the app supports in this way? What fees apply to each part?                                                        | The "USDT in. Naira out. Sent." scene shows it, before fees.                              |
| B   | **Footer:** the company name, RC number and address, a support contact, and the Terms and Privacy pages.                                                                                         | The footer says "© Blox" only, and links to pages that do not exist yet.                  |

## 9. The Features and Help pages

Every line on these pages comes from the feature list. Nothing about limits, fees, timings, licences or contact details is on them, because we do not have those. They need a read-through by someone who knows the product.

|     | Question                                                                                                                                           | Why we ask                                                                                                                   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| A   | Please **read the Help answers** (18 of them, on the Help page) and the **Features page** and mark anything that is wrong, too strong, or missing. | These are public promises about how the product behaves.                                                                     |
| A   | What is the **support contact**: email, phone, WhatsApp, in-app chat, and the hours?                                                               | The Help page has no "contact us" section, because we will not invent one. It is the most useful thing a help page can have. |
| B   | What **common questions** do users ask? Fees, limits, how long a withdrawal takes, what to do if a KYC check is rejected, a forgotten PIN.         | These are the real help topics, and we have left them out rather than guess.                                                 |
| B   | Are the **Fees** and **Security** pages wanted as separate pages? The nav and footer link to both, and neither exists yet.                         | They currently lead to a "not found" page.                                                                                   |
