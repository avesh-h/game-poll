import { SignJWT } from 'jose';

export const generateTokenForMember = async (payload) => {
  const secret = process.env.ACCESS_TOKEN_SECRET || 'secret';
  //Key only acceptes one of these symmetric secrets ['CryptoKey','Uint8Array']
  //in short we need to convert our secret key into any of these encoded text.
  const encodedKey = new TextEncoder().encode(secret);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(encodedKey);

  return token;
};
