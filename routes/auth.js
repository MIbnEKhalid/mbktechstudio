export const authenticate = (authentication) => {
  return (req, res, next) => {
    const token = req.headers["authorization"];
    console.log(`Received token: ${token}`);
    if (token === authentication) {
      console.log("Authentication successful");
      next();
    } else {
      console.log("Authentication failed");
      res.status(401).send("Unauthorized");
    }
  };
};
