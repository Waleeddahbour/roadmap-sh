export const authDecoder = (authHeader) => {
  const encodedCreds = authHeader.trim().replace(/Basic\s+/i, "");

  const decodedCreds = Buffer.from(encodedCreds, "base64").toString("utf-8");
  const [username, password] = decodedCreds.split(":");
  return { username, password };
};
