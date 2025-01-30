import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [step, setStep] = useState(1); // 1: Login, 2: OTP, 3: Thank You

  // Hardcoded OTP
  const otp = '123456'; 

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulating user validation
    const validEmail = 'shrirakshaacharya@example.com';
    const validPassword = 'example9201$';

    if (email === validEmail && password === validPassword) {
      setError('');
      setOtpSent(true);
      setStep(2); // Proceed to OTP step
    } else {
      setError("Sorry, we can't log you in.");
    }
  };

  const handleOtpVerification = (e) => {
    e.preventDefault();

    // Check if entered OTP matches the hardcoded OTP
    if (enteredOtp === otp) {
      setOtpError('');
      setIsLoggedIn(true);
      setStep(3); // Proceed to Thank You step
    } else {
      setOtpError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="login-container">
      {step === 1 && (
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
      )}

      {step === 2 && otpSent && (
        <form onSubmit={handleOtpVerification} className="otp-form">
          <h2>OTP Verification</h2>
          <p>We have sent a 6-digit OTP to your email.</p>
          <div className="input-group">
            <label htmlFor="otp">Enter OTP</label>
            <input
              type="text"
              id="otp"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              placeholder="Enter the OTP"
              required
            />
          </div>
          {otpError && <p className="error">{otpError}</p>}
          <button type="submit">Verify OTP</button>
        </form>
      )}

      {step === 3 && isLoggedIn && (
        <div className="thank-you">
          <h2>Thank You for Logging In!</h2>
          <p>Welcome, {email}!</p>
        </div>
      )}
    </div>
  );
};

export default Login;
