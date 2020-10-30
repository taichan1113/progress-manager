import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <section className="container">
      <h1 className="page-title">Sign Up</h1>
      <form className="form" action="/personal">
        <div className="form-group">
          <input type="text" placeholder="Name" />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Confirm Password" />
        </div>
        <input type="submit" value="Register" className="btn btn-primary" />
        <p className="my-1">
          Already have an accout? <Link to="login">Sign In</Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
