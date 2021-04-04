import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

export default function Order({ order, currentUser }) {
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onsuccess: () => {
      Router.push('/orders');
    },
  });

  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return (
      <div className='jumbotron mt-5'>
        <h1 className='display-4'>Order has expired</h1>
        <hr className='my-4'></hr>
        <div className='row'>
          <Link href='/'>
            <a>Back to main page</a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='jumbotron mt-5'>
      <h1 className='display-4'>order details</h1>
      <hr className='my-4'></hr>
      <div className='row my-1'>ticket title: {order.ticket.title}</div>
      <div className='row my-1'>ticket price: {order.ticket.price}</div>
      <div className='row my-1'>expiration delay: {timeLeft}</div>
      {errors && (
        <div className='row'>
          <div className='offset-md-2 col-md-8'>{errors}</div>
        </div>
      )}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey={process.env.STRIPE_PUBLIC_KEY}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      >
        <button type='button' className='btn btn-secondary my-1'>
          Proceed paiement
        </button>
      </StripeCheckout>
    </div>
  );
}

Order.getInitialProps = async (client, context) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};
