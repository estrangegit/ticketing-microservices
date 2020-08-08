import axios from 'axios';

export default class CommentCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', errors: [] };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/users/signup', {
        email: this.state.email,
        password: this.state.password,
      });
      this.setState({ email: '', password: '', errors: '' });
    } catch (err) {
      this.setState({ ...this.state, errors: err.response.data.errors });
    }
  };

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value, password: this.state.password });
  };

  handlePasswordChange = (event) => {
    this.setState({ email: this.state.email, password: event.target.value });
  };

  buildErrors = (field) => {
    console.log(this.state.errors);

    return this.state.errors
      .filter((err) => {
        return err.field === field;
      })
      .map((err) => {
        return (
          <div key={err.message} className='row'>
            <div className='offset-md-2 col-md-8 alert alert-danger'>
              {err.message}
            </div>
          </div>
        );
      });
  };

  render() {
    let emailErrors = this.buildErrors('email');
    let passwordErrors = this.buildErrors('password');

    return (
      <div className='container'>
        <form onSubmit={this.handleSubmit}>
          <h1 className='text-center'>Sign up</h1>
          <div className='row'>
            <div className='form-group offset-md-2 col-md-8'>
              <label>Email Address</label>
              <input
                value={this.state.email}
                onChange={this.handleEmailChange}
                className='form-control'
              />
            </div>
          </div>
          {emailErrors}
          <div className='row'>
            <div className='form-group offset-md-2 col-md-8'>
              <label>Password</label>
              <input
                type='password'
                value={this.state.password}
                onChange={this.handlePasswordChange}
                className='form-control'
              />
            </div>
          </div>
          {passwordErrors}
          <div className='row'>
            <div className='offset-md-2'>
              <button className='btn btn-primary'>Submit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
