// For Edit the details of the Game

export const PUT = async (req, context) => {
  console.log('context', context);
  const requestBody = await req.json();
  console.log('reqqqq', requestBody);
};
