import React, { useState } from "react";
import axios from "axios";
import "../../src/index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackgroundSvg from "../images/114.svg";
import { motion } from "framer-motion";
import leftLeaf from "../images/s1.jpg";
import rightLeaf from "../images/s1.jpg";

function Register() {
  // Only allow roles that backend accepts
  const validRoles = [
    'admin', 'farmer', 'OrganicFarmer', 'cropFarmer', 'greenhouseFarmer', 'forester', 'gardener', 'soilTester', 'agriculturalResearcher'
  ];
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    country: "",
    password: "",
    confirmPassword: "",
    role: "farmer",
    phoneNumber: "",
    location: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "phoneNumber") {
      if (!/^[+\d]*$/.test(value)) return;
    } else if (
      (id === "firstName" || id === "lastName") &&
      /\d/.test(value)
    ) {
      return;
    }
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "password") {
      const passwordErrors = validatePassword(value);
      setValidationErrors((prev) => ({ ...prev, password: passwordErrors }));
    } else if (id === "confirmPassword") {
      setValidationErrors((prev) => ({
        ...prev,
        confirmPassword:
          value !== formData.password ? ["Passwords do not match"] : [],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      fullName: `${formData.firstName} ${formData.lastName}`,
      phoneNumber: formData.phoneNumber,
      location: formData.location || formData.country,
    };

    try {
      const response = await axios.post(
        "http://localhost:5557/api/auth/register",
        userData
      );

      toast.success("Registration successful! You are now logged in.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        dateOfBirth: "",
        gender: "",
        country: "",
        password: "",
        confirmPassword: "",
        role: "farmer",
        phoneNumber: "",
        location: "",
      });

      setTimeout(() => {
        window.location.href = "/loghome";
      }, 1000);
    } catch (err) {
      console.error("Error during registration:", err.response?.data);
      if (err.response?.data?.message === "Email already in use") {
        setError("This email is already registered. Please use another.");
      } else if (err.response?.data?.message === "Username already taken") {
        setError("This username is already taken. Please choose another.");
      } else {
        setError(
          err.response?.data?.message ||
            "Invalid input data, please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    setValidationErrors({});

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errors.email = "Valid email is required";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phoneNumber)) {
      errors.phoneNumber =
        "Enter a valid phone number with country code (e.g. +91...)";
    }

    if (!formData.role) {
      errors.role = "Role is required";
    }
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
    }
    if (!formData.gender) {
      errors.gender = "Gender is required";
    }
    if (!formData.country) {
      errors.country = "Country is required";
    }
    if (!formData.location.trim()) {
      errors.location = "Specific location/address is required";
    }

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = ["Passwords do not match"];
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
    if (!/[0-9]/.test(password)) errors.push("At least one number");
    if (!/[@#$%^&*(),.?\":{}|<>]/.test(password))
      errors.push("At least one special character");
    return errors;
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Background */}
      <div
        style={{
          backgroundImage: `url(${BackgroundSvg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(5px)",
        }}
        className="absolute top-0 left-0 w-full h-full -z-10"
      ></div>
      <div
        className="absolute top-0 left-0 w-full h-full bg-opacity-50"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
      />
      <div className="relative w-full min-h-screen m-auto overflow-hidden scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-200">
        {/* Floating Leaves */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute left-0 top-2/3 transform -translate-y-1/4 rotate-0"
        >
          <motion.img
            src={leftLeaf}
            alt="Left Leaf"
            className="w-80 h-auto filter drop-shadow-2xl"
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute right-0 top-2/3 transform -translate-y-1/4 -rotate-0 scale-x-[-1]"
        >
          <motion.img
            src={rightLeaf}
            alt="Right Leaf"
            className="w-80 h-auto filter drop-shadow-2xl"
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl mt-12 font-bold mb-6 justify-center flex">
          <span className="text-green-600 font-weight-bold text-3xl">
            Sign Up for
          </span>
          <span className="text-black ml-4 text-3xl"> Florista</span>
        </h1>

        {/* Form */}
        <form
          className="ml-auto mr-auto rounded-3xl px-10 pt-8 pb-10 mb-6 -mt-2 bg-white shadow-xl w-1/2"
          onSubmit={handleSubmit}
        >
          {/* First & Last Name */}
          <div className="flex justify-between gap-4">
            <div className="w-full">
              <label
                className="block text-gray-700 text-sm font-bold mt-2 mb-2"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                className={`shadow-lg my-1 focus:outline-none focus:border-green-600 appearance-none border rounded w-full py-3 px-4 text-gray-700 ${
                  validationErrors.firstName ? "border-red-500" : ""
                }`}
                id="firstName"
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              {validationErrors.firstName && (
                <p className="text-red-500 text-xs italic mt-1">
                  {validationErrors.firstName}
                </p>
              )}
            </div>
            <div className="w-full">
              <label
                className="block text-gray-700 text-sm font-bold mt-2 mb-2"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                className={`shadow-lg my-1 focus:outline-none focus:border-green-600 appearance-none border rounded w-full py-3 px-4 text-gray-700 ${
                  validationErrors.lastName ? "border-red-500" : ""
                }`}
                id="lastName"
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              {validationErrors.lastName && (
                <p className="text-red-500 text-xs italic mt-1">
                  {validationErrors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Username & Email */}
          <div className="flex justify-between gap-4">
            <div className="w-full">
              <label
                className="block text-gray-700 text-sm font-bold mt-2 mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="shadow-lg my-1 focus:outline-none focus:border-green-600 appearance-none border rounded w-full py-3 px-4 text-gray-700"
                id="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full">
              <label
                className="block text-gray-700 text-sm font-bold mt-2 mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className={`shadow-lg my-1 focus:outline-none focus:border-green-600 appearance-none border rounded w-full py-3 px-4 text-gray-700 ${
                  validationErrors.email ? "border-red-500" : ""
                }`}
                id="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs italic mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>
          </div>

          {/* Role */}
          <div className="w-full">
            <label
              className="block text-gray-700 text-sm font-bold mt-2 mb-2"
              htmlFor="role"
            >
              Role
            </label>
            <select
              className={`shadow-lg my-1 focus:outline-none focus:border-green-600 appearance-none border rounded w-full py-3 px-4 text-gray-700 ${
                validationErrors.role ? "border-red-500" : ""
              }`}
              id="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Role</option>
              {validRoles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            {validationErrors.role && (
              <p className="text-red-500 text-xs italic mt-1">
                {validationErrors.role}
              </p>
            )}
          </div>

          {/* DOB, Gender, Country */}
          <div className="flex justify-between gap-4">
            <div className="w-full">
              <label
                className="block text-gray-700 text-sm font-bold mt-2 mb-2"
                htmlFor="dateOfBirth"
              >
                Date of Birth
              </label>
              <input
                className="shadow-lg my-1 focus:outline-none focus:border-green-600 appearance-none border rounded w-full py-3 px-4 text-gray-700"
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full">
              <label
                className="block text-gray-700 text-sm font-bold mt-2  mb-2"
                htmlFor="gender"
              >
                Gender
              </label>
              <select
                className="shadow-lg my-1 focus:outline-none focus:border-green-600 appearance-none border rounded w-full py-3 px-4 text-gray-700"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="w-full">
              <label
                className="block text-gray-700 text-sm font-bold mt-2 mb-2"
                htmlFor="country"
              >
                Country
              </label>
              <select
                className="shadow-lg my-1 focus:outline-none focus:border-green-600 appearance-none border rounded w-full py-3 px-4 text-gray-700"
                id="country"
                value={formData.country}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Country
                </option>
                {[
                  "Afghanistan",
                  "Albania",
                  "Algeria",
                  "Argentina",
                  "Australia",
                  "Bangladesh",
                  "Brazil",
                  "Canada",
                  "China",
                  "Egypt",
                  "France",
                  "Germany",
                  "India",
                  "Indonesia",
                  "Italy",
                  "Japan",
                  "Malaysia",
                  "Mexico",
                  "Pakistan",
                  "Russia",
                  "Saudi Arabia",
                  "South Africa",
                  "South Korea",
                  "Spain",
                  "Sri Lanka",
                  "Thailand",
                  "Turkey",
                  "United Arab Emirates",
                  "United Kingdom",
                  "United States",
                ].map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="w-full">
            <label
              className="block text-gray-700 text-sm font-bold mt-2 mb-2"
              htmlFor="location"
            >
              Specific Location/Address
            </label>
            <input
              className={`shadow-lg my-1 focus:outline-none focus:border-green-600 appearance-none border rounded w-full py-3 px-4 text-gray-700 ${
                validationErrors.location ? "border-red-500" : ""
              }`}
              id="location"
              type="text"
              placeholder="Enter your specific location or address"
              value={formData.location}
              onChange={handleChange}
              required
            />
            {validationErrors.location && (
              <p className="text-red-500 text-xs italic mt-1">
                {validationErrors.location}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex justify-between gap-4">
            <div className="w-full">
              <label
                className="block text-gray-700 text-sm font-bold mt-3 mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className={`shadow-lg my-1 focus:outline-none focus:border-green-600 appearance-none border rounded w-full py-3 px-4 text-gray-700 ${
                    validationErrors.password &&
                    validationErrors.password.length > 0
                      ? "border-red-500"
                      : ""
                  }`}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="******************"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {validationErrors.password &&
                validationErrors.password.length > 0 && (
                  <ul className="text-red-500 text-xs italic mt-1">
                    {validationErrors.password.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
            </div>

            <div className="w-full">
              <label
                className="block text-gray-700 text-sm font-bold mt-3 mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  className={`shadow-lg my-1 focus:outline-none focus:border-green-600 appearance-none border rounded w-full py-3 px-4 text-gray-700 ${
                    validationErrors.confirmPassword &&
                    validationErrors.confirmPassword.length > 0
                      ? "border-red-500"
                      : ""
                  }`}
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="******************"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {validationErrors.confirmPassword &&
                validationErrors.confirmPassword.length > 0 && (
                  <ul className="text-red-500 text-xs italic mt-1">
                    {validationErrors.confirmPassword.map(
                      (error, index) => (
                        <li key={index}>{error}</li>
                      )
                    )}
                  </ul>
                )}
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-xs italic">{error}</p>}

          {/* Submit */}
          <div className="flex items-center justify-between mt-6">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;
