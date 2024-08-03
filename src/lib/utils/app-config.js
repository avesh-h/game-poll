const AppConfig = {
  development: {
    apiUrl: 'http://localhost:3000',
    delegateServerUrl: 'http://localhost:3002',
    // apiUrl: 'https://play-o-time.onrender.com',
  },
  production: {
    //Vercel is off for now
    // apiUrl: 'https://game-poll.vercel.app',
    apiUrl: 'https://play-o-time.onrender.com',
    delegateServerUrl: 'https://game-poll-server.onrender.com',
  },
};

export default AppConfig;
