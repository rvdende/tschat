# commands:

```bash
npx create-react-app@latest tschat --template typescript
cd tschat
git remote add origin git@github.com:rvdende/tschat.git
mkdir src/server
mkdir src/shared

# backend
yarn add express morgan ws
yarn add @types/express @types/morgan @types/node @types/ws -D

# frontend
yarn add @mui/material @emotion/react @emotion/styled @mui/icons-material
```

# watch build server
yarn run buildserver -w


# dev cert 

https://github.com/FiloSottile/mkcert