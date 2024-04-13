import jwt from 'jsonwebtoken';

export const generateTokenForMember = (userData) => {
  try {
    const payload = {
      id: userData?._id,
      ...(userData?.email && { email: userData?.email }),
      gameId: userData?.gameId,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });
    return accessToken;
  } catch (error) {
    return error;
  }
};
