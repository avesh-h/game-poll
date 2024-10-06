// app/not-found.js

const CustomNotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Game Not Available</h1>
      <p>
        Sorry, the game you’re looking for has either expired or has been
        cancelled by the organizer.
      </p>
    </div>
  );
};

export default CustomNotFoundPage;
