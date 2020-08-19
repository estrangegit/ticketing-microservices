import Router from 'next/router';
import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';

export default function Signout() {
  const { doRequest, errors } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onsuccess: () => {
      Router.push('/');
    },
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out...</div>;
}
