export default function Ticket({ ticket }) {
  return (
    <div class='jumbotron mt-5'>
      <h1 class='display-4'>ticket details</h1>
      <hr class='my-4'></hr>
      <p>title: {ticket.title}</p>
      <p>price: {ticket.price}</p>
    </div>
  );
}

Ticket.getInitialProps = async (client, context) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};
