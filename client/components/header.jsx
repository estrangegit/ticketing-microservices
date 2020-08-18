import Link from 'next/link';

const Header = (props) => {
  return (
    <nav className='navbar navbar-light bg-light'>
      <Link href='/'>
        <a className='navbar-brand'>ticketing-dev</a>
      </Link>

      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>
          {props.currentUser ? 'Sign out' : 'Sign in/up'}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
