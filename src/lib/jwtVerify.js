import { jwtVerify } from "jose";

const getSecretKey = () => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    return new Error("Cannot found secret key");
  }
  return secret;
};

export const verifyAuth = async (token) => {
  try {
    const decoded = await jwtVerify(
      token,
      new TextEncoder().encode(getSecretKey())
    );
    return decoded.payload;
  } catch (error) {
    return new Error("Jwt expired!");
  }
};
