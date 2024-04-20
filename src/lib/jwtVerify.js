import { jwtVerify } from 'jose';

const getSecretKey = () => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    return new Error('Cannot found secret key');
  }
  return secret;
};

export const verifyAuth = async (token) => {
  const encodedKey = new TextEncoder().encode(getSecretKey());
  try {
    const decoded = await jwtVerify(token, encodedKey, {});
    return decoded;
  } catch (error) {
    return { error: error?.message };
  }
};
