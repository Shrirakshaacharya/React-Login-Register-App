import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    age: '',
    dob: '',
    image: null,
  });
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData({
      ...formData,
      [id]: files ? files[0] : value,
    });
  };

  const validateForm = () => {
    const { name, email, password, companyName, age, dob, image } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!name || !email || !password || !companyName || !age || !dob || !image) {
      return 'All fields are required.';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email.';
    }
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.';
    }
    if (isNaN(age) || age < 18 || age > 100) {
      return 'Age must be a number between 18 and 100.';
    }
    if (!['image/png', 'image/jpeg'].includes(image.type)) {
      return 'Image must be in PNG or JPG format.';
    }
    if (image.size > 2 * 1024 * 1024) {
      return 'Image size must not exceed 2MB.';
    }
    return '';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    try {
      // Simulate API call
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Replace with actual API call
      // await fetch('/api/register', { method: 'POST', body: formDataToSend });

      setIsRegistered(true);
    } catch (err) {
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div className="register-container">
      {isRegistered ? (
        <div>
          <h2>Thank You for Registering!</h2>
          <p>We have successfully received your details.</p>
          <button
            onClick={() => {
              const confirmDelete = window.confirm("Are you sure you want to delete your account?");
              if (confirmDelete) {
                // Simulate account deletion
                alert("Account has been successfully removed.");
                setIsRegistered(false); // Reset to allow re-registration
              }
            }}
            className="remove-account-btn"
          >
            Remove Account
          </button>
        </div>
      ) : (
        <form onSubmit={handleRegister} className="register-form">
          {['name', 'email', 'password', 'companyName', 'age', 'dob'].map((field) => (
            <div className="input-group" key={field}>
              <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field === 'dob' ? 'date' : field === 'age' ? 'number' : field === 'password' ? 'password' : 'text'}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter your ${field}`}
                required
              />
            </div>
          ))}
          <div className="input-group">
            <label htmlFor="image">Upload Image</label>
            <input
              type="file"
              id="image"
              onChange={handleChange}
              accept="image/png, image/jpeg"
              required
            />
          </div>
          {formData.image && (
            <div className="image-preview">
              <p>Image Preview:</p>
              <img src={URL.createObjectURL(formData.image)} alt="Preview" width="100" />
            </div>
          )}
          {error && <p className="error">{error}</p>}
          <button type="submit">Register</button>
        </form>
      )}
    </div>
  );
};

export default Register;
