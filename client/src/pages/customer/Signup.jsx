import { useState } from "react";
import { Link } from "react-router";
import cartIcons from "../../assets/images/cart-icons.png";
import api from "../../services/api";
function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };
  async function handleSubmit(e) {
    e.preventDefault();
    const body = {
      name,
      email,
      password,
    };
    try {
      const res = await api.post("/auth/register", body);
      console.log(name, email, password);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setEmail("");
      setPassword("");
      setName("");
    }
  }
  return (
    <main className="min-vh-100 bg-light d-flex align-items-center justify-content-center px-3">
      <section
        className="card border-0 shadow-lg rounded-4 p-4 p-md-5 w-100"
        style={{ maxWidth: "420px" }}
      >
        {/* Header with high-contrast green badge */}
        <div className="text-center mb-4">
          <div
            className="bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm"
            style={{ width: "56px", height: "56px" }}
          >
            <img
              src={cartIcons}
              alt="Store Logo"
              style={{ width: "28px", height: "28px", objectFit: "contain" }}
            />
          </div>
          <h1 className="h3 fw-bold text-dark mb-1">Register</h1>
          <p className="text-muted small mb-0">Create a new account</p>
        </div>

        {/* Form */}
        <form
          action=""
          method="post"
          className="d-flex flex-column gap-3"
          onSubmit={handleSubmit}
        >
          <input
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
            type="text"
            placeholder="Full Name"
            className="form-control form-control-lg fs-6 bg-light"
          />
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            type="email"
            placeholder="Email Address"
            className="form-control form-control-lg fs-6 bg-light"
          />
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            type="password"
            placeholder="Password"
            className="form-control form-control-lg fs-6 bg-light"
          />
          <button
            type="submit"
            className="btn btn-success btn-lg fs-6 fw-semibold w-100 mt-1"
          >
            Sign Up
          </button>
          <div className="d-flex align-items-center my-3">
            <hr className="flex-grow-1" />
            <span className="px-2 text-muted small">OR</span>
            <hr className="flex-grow-1" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2 py-2"
          >
            <span>Continue with Google</span>
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-muted small mt-4 mb-0">
          Already have an account?{" "}
          <Link
            to="/login"
            className="fw-semibold text-success text-decoration-none"
          >
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
export default Signup;
