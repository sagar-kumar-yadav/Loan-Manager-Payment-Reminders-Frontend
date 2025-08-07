import { useFormik } from "formik";
import { registerSchema } from "../../schemas/schemas";
import { useState } from "react";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      validationSchema: registerSchema,
      onSubmit: async (values) => {
        try {
          setLoading(true);
          const { data } = await API.post("/api/auth/register", {
            name: values.name,
            email: values.email,
            password: values.password,
          });
          // Redirect to OTP verification page with email
          navigate("/verify-otp", {
            state: { email: values.email },
          });
        } catch (err) {
          setError(
            err.response?.data?.message ||
              "Registration failed. Please try again."
          );
        } finally {
          setLoading(false);
        }
      },
    });

  return (
    <>
      {/* Error Message */}
      {error && <div className="alert error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            className={errors.name && touched.name ? "error-input" : ""}
          />
          {errors.name && touched.name && (
            <p className="error-message">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            className={errors.email && touched.email ? "error-input" : ""}
          />
          {errors.email && touched.email && <p>{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            className={errors.password && touched.password ? "error-input" : ""}
          />
          {errors.password && touched.password && <p>{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            className={
              errors.confirmPassword && touched.confirmPassword
                ? "error-input"
                : ""
            }
          />
          {errors.confirmPassword && touched.confirmPassword && (
            <p>{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={loading ? "loading" : ""}
        >
          {loading ? "Processing..." : "Register"}
        </button>
      </form>

      <div className="login-link">
        Already have an account? <a href="/login">Sign In</a>
      </div>
    </>
  );
};

export default Register;
