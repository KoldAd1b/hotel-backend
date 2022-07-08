const createUserPayload = (user) => {
  return {
    id: user._id,
    name: user.username,
    role: user.role,
  };
};
module.exports = createUserPayload;
