import buildClient from '../api/build-client';

const LandingPage = (props) => {
  if (props.currentUser) {
    return (
      <div className='container'>
        <h1>This is the landing page</h1>
        <h2>
          You have signed in with the following email: {props.currentUser.email}
        </h2>
      </div>
    );
  } else {
    return (
      <div className='container'>
        <h1>This is the landing page</h1>
        <h2>You are not signed in</h2>
      </div>
    );
  }
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
};

export default LandingPage;
