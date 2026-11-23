import { useState } from "react";
import { Link, useNavigate } from "react-router";
import cartIcons from "../../assets/images/cart-icons.png";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const body = {
      email,
      password,
    };
    try {
      const res = await api.post("/auth/login", body, {
        withCredentials: true,
      });
      login(res.data.user);

      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setEmail("");
      setPassword("");
    }
  }
  return (
    <main className="min-vh-100 bg-light d-flex align-items-center justify-content-center px-3">
      <section
        className="card border-0 shadow-lg rounded-4 p-4 p-md-5 w-100"
        style={{ maxWidth: "420px" }}
      >
        {/* Header with matching green badge */}
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
          <h1 className="h3 fw-bold text-dark mb-1">Welcome Back</h1>
          <p className="text-muted small mb-0">Sign in to your account</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          action=""
          method="post"
          className="d-flex flex-column gap-3"
        >
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            type="email"
            placeholder="Email Address"
            className="form-control form-control-lg fs-6 bg-light"
            required
          />
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            type="password"
            placeholder="Password"
            className="form-control form-control-lg fs-6 bg-light"
            required
          />

          {/* Remember Me & Forgot Password row */}
          <div className="d-flex align-items-center justify-content-between small">
            <div className="form-check mb-0">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
              />
              <label
                className="form-check-label text-muted"
                htmlFor="rememberMe"
              >
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-success fw-semibold text-decoration-none"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-success btn-lg fs-6 fw-semibold w-100 mt-1"
          >
            Login
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

        {/* Footer link to Signup */}
        <p className="text-center text-muted small mt-4 mb-0">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="fw-semibold text-success text-decoration-none"
          >
            Sign Up
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
