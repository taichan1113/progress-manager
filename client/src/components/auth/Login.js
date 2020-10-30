import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <section className="container">
      <h1 className="page-title">Sign In</h1>
      <form className="form" action="/personal">
        <div className="form-group">
          <input type="email" placeholder="EmailAddress" />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" />
        </div>
        <input type="submit" value="Login" className="btn btn-primary" />
        <p className="my-1">
          Already have an accout? <Link to="/register">Sign Up</Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
