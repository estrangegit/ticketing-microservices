import axios from 'axios';

export default function HomePage(props) {
  if (props.currentUser) {
    return (
      <div className='container'>
        <h1>This is the landing page</h1>
        <h2>
          You are currently logged in with the following email:{' '}
          {props.currentUser.email}
        </h2>
      </div>
    );
  } else {
    return (
      <div className='container'>
        <h1>This is the landing page</h1>
        <h2>Please login to access the web site</h2>
      </div>
    );
  }
}

export async function getServerSideProps(context) {
  const response = await axios.get(
    'http://auth-srv:3000/api/users/currentuser',
    {
      headers: context.req.headers,
    }
  );
  return { props: response.data };
}
