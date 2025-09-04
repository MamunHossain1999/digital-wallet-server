<!-- project setup url -->
mkdir digital-wallet-api
cd digital-wallet-api
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv cors
npm install -D typescript ts-node-dev @types/express @types/node @types/cors @types/bcryptjs @types/jsonwebtoken
npx tsc --init
npm install morgan cookie-parser && npm install -D @types/morgan @types/cookie-parser
npm install express-async-handler
npm install zod
npm install express-async-handler






<!-- file stucture ready -->
auth interface
auth model
auth controller
auth route



Project Overview
Digital Wallet API is a secure, modular, and role-based backend API built with Express.js and Mongoose.
This API allows users to register, manage wallets, and perform core financial operations such as adding money, withdrawing, sending money, and viewing transaction history.
Additionally, agents and admins have their own specific roles and permissions.

Features
JWT-based Authentication and Role-based Authorization (admin, user, agent)

Automatic wallet creation with initial balance of ৳50 on user or agent registration

Users can:

Top-up their own wallet

Withdraw money from their wallet

Send money to other users

View their transaction history

Agents can:

Add money to any user’s wallet (Cash-in)

Withdraw money from any user’s wallet (Cash-out)

(Optional) View commission history

Admins can:

View all users, agents, wallets, and transactions

Block/unblock user wallets

Approve or suspend agents

(Optional) Set system parameters such as transaction fees

Technology Stack
Node.js (Express.js)

MongoDB (Mongoose)

JWT for Authentication

bcrypt for Password Hashing

TypeScript (optional)

Postman for API testing


Live link: https://digital-wallet-system-rose.vercel.app/

npm install google-auth-library
npm install passport passport-google-oauth20
