import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default function Ticket({ ticket }) {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onsuccess: (order) => {
      Router.push('/orders/[orderId]', `/orders/${order.id}`);
    },
  });

  return (
    <div className='jumbotron mt-5'>
      <h1 className='display-4'>ticket details</h1>
      <hr className='my-4'></hr>
      <div className='row my-1'>title: {ticket.title}</div>
      <div className='row my-1'>price: {ticket.price}</div>
      {errors && (
        <div className='row'>
          <div className='offset-md-2 col-md-8'>{errors}</div>
        </div>
      )}
      <button
        onClick={() => doRequest()}
        type='button'
        className='btn btn-secondary my-1'
      >
        Purchase
      </button>
    </div>
  );
}

Ticket.getInitialProps = async (client, context) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};
