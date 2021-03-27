import Router from 'next/router';
import { useState } from 'react';
import useRequest from '../../hooks/use-request';

export default function NewTicket() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onsuccess: () => {
      Router.push('/');
    },
  });

  const onPriceBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1 className='text-center'>Create a ticket</h1>
        <div className='row'>
          <div className='form-group offset-md-2 col-md-8'>
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='form-control'
            />
          </div>
        </div>
        <div className='row'>
          <div className='form-group offset-md-2 col-md-8'>
            <label>Price</label>
            <input
              value={price}
              onBlur={onPriceBlur}
              onChange={(e) => setPrice(e.target.value)}
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
            <button className='btn btn-primary'>Create</button>
          </div>
        </div>
      </form>
    </div>
  );
}
