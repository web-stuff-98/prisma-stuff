const getIP = (req: any) =>
  req.ip ||
  req.headers["x-forwarded-for"] ||
  req.headers["x-real-ip"] ||
  req.connection.remoteAddress;
export default getIP