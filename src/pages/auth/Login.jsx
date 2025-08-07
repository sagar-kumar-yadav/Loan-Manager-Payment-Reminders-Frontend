import { useFormik } from "formik";
import { loginSchema } from "../../schemas/schemas";
import { useState } from "react";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: loginSchema,
      onSubmit: async (values) => {
        try {
          setLoading(true);
          setError("");

          // API call to login
          const { data } = await API.post("/api/auth/login", {
            email: values.email,
            password: values.password,
          });

          // Store token (JWT) in localStorage
          localStorage.setItem("token", data.token);

          // Redirect to dashboard
          navigate("/dashboard");

        } catch (err) {
          setError(
            err.response?.data?.message || 
            "Login failed. Please try again."
          );
        } finally {
          setLoading(false);
        }
      },
    });

  return (
    <div className="login-form">
      <h2>Login</h2>
      
      {error && <div className="alert error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            className={errors.email && touched.email ? "error-input" : ""}
          />
          {errors.email && touched.email && (
            <div className="error-message">{errors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            className={errors.password && touched.password ? "error-input" : ""}
          />
          {errors.password && touched.password && (
            <div className="error-message">{errors.password}</div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={loading ? "loading" : ""}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="auth-links">
        <a href="/forgot-password">Forgot Password?</a>
        <span>Don't have an account? <a href="/register">Register</a></span>
      </div>
    </div>
  );
};

export default Login;