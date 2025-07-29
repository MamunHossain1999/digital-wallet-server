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






<!-- file stucture ready -->
auth interface
auth model
auth controller
auth route
