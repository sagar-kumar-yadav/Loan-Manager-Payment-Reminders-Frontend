import { useFormik } from "formik";
import { forgotPasswordSchema } from "../../schemas/schemas";
import { useState } from "react";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: forgotPasswordSchema,
      onSubmit: async (values) => {
        try {
          setLoading(true);
          setError("");

          // Step 1: Request password reset (sends OTP)
          const { data } = await API.post("/auth/forgot-password", {
            email: values.email,
          });

          // Step 2: Redirect to OTP verification with email
          navigate("/verify-reset-otp", { 
            state: { 
              email: values.email,
              purpose: "password_reset" // To distinguish from registration OTP
            } 
          });

        } catch (err) {
          setError(
            err.response?.data?.message || 
            "Failed to send OTP. Please try again."
          );
        } finally {
          setLoading(false);
        }
      },
    });

  return (
    <div className="forgot-password-form">
      <h2>Forgot Password</h2>
      <p>Enter your email to receive a reset OTP</p>
      
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

        <button 
          type="submit" 
          disabled={loading}
          className={loading ? "loading" : ""}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;