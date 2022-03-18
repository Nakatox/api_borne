# Borne Project

The Terminal project is a project aimed at reproducing the terminal system that can be found at McDo. This application allows you to manage the admin part, kitchen and terminal in real time.

## Setup Back

- First you need to **clone the repo**

```bash
git clone https://github.com/Nakatox/api_borne

cd api_borne
```

- Install the **depencies**

```bash
yarn
```

## Configure project

### Database

- First, you need to create a **MySql database** and connect it in the **database.ts**
- Then you need to **load all fixtures** to make the project working

```bash
yarn fixtures src/Fixtures --sync --require=ts-node/register
```

### Mailer

If you want to have the mail (its optionnal)

- You need to create a account on a mailbox (i recommand you : [https://mailtrap.io](https://mailtrap.io/))
- Then go to your mail box and in the configure part.
- Go in the project in the “mail.ts” file and enter your configuration like the exemple

## Start the project

Just launch in the terminal ****

```bash
nodemon src/app.ts
```

## Setup Front

→ Go check on this repo to see the frontend part (and the utilisation on the app): https://github.com/Nakatox/front_borne