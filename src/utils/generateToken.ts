import jwt from "jsonwebtoken";

const generateToken = (payload: {
  id: string;
  email: string;
  role: string;
  agencyId?: string | null;
}): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = (process.env.JWT_EXPIRES_IN as string) || "7d";

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export default generateToken;