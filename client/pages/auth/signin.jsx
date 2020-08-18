import Router from 'next/router';
import { useState } from 'react';
import useRequest from '../../hooks/useRequest';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    onsuccess: () => {
      Router.push('/');
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <h1 className='text-center'>Sign in</h1>
        <div className='row'>
          <div className='form-group offset-md-2 col-md-8'>
            <label>Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='form-control'
            />
          </div>
        </div>
        <div className='row'>
          <div className='form-group offset-md-2 col-md-8'>
            <label>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='form-control'
            />
          </div>
        </div>
        {errors && (
          <div className='row'>
            <div className='offset-md-2 col-md-8'>{errors}</div>
          </div>
        )}
        <div className='row'>
          <div className='offset-md-2'>
            <button className='btn btn-primary'>Sign in</button>
          </div>
        </div>
      </form>
    </div>
  );
}
