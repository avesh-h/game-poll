export const config = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  SERVER_URL: process.env.SERVER_URL,
  NEXT_PUBLIC_NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
};

export const AppConfig = {
  development: {
    apiUrl: 'http://localhost:3000',
    delegateServerUrl: 'http://localhost:3002',
    // apiUrl: 'https://play-o-time.onrender.com',
  },
  production: {
    //Vercel is off for now
    // apiUrl: 'https://game-poll.vercel.app',
    apiUrl: config.NEXT_PUBLIC_NEXTAUTH_URL,
    delegateServerUrl: config.NEXT_PUBLIC_SERVER_URL,
  },
};
