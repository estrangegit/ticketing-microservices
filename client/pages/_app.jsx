import 'bootstrap/dist/css/bootstrap.css';
import { buildAuthClient } from '../api/build-client';
import Header from '../components/header';

function AppComponent({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className='container'>
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
}

AppComponent.getInitialProps = async (appContext) => {
  const client = buildAuthClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentUser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      data.currentUser
    );
  }

  return { pageProps, ...data };
};

export default AppComponent;
