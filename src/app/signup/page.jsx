'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Select from 'react-select';
import Image from 'next/image';
import zxcvbn from 'zxcvbn';

const countries = [
  { code: "+98", name: "Iran", flag: "🇮🇷", value: "IR" },
  { code: "+1", name: "United States", flag: "🇺🇸", value: "US" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧", value: "GB" },
  { code: "+39", name: "Italy", flag: "🇮🇹", value: "IT" },
  { code: "+91", name: "India", flag: "🇮🇳", value: "IN" },
];

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    phone: "",
    password: "",
    repeat: "",
    firstName: "",
    lastName: "",
    username: "",
    countryCode: "+98",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'password') {
      const result = zxcvbn(e.target.value);
      setPasswordStrength({
        score: result.score,
        feedback: result.feedback.suggestions.join(', ') || "Good password!",
      });
    }
  };

  const handleFirstStep = (e) => {
    e.preventDefault();
    if (form.password !== form.repeat) return setError("Passwords don't match.");
    if (form.password.length < 8) return setError("Password too short.");
    setError("");
    setStep(2);
  };

  const handleCheckUsername = (username) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find((u) => u.username === username);
    setUsernameError(exists ? "Username not available" : "");
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (usernameError) return;
    setLoading(true);
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const newUser = {
      phone: form.phone,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    setLoading(false);
    alert("ثبت‌نام با موفقیت انجام شد ✅");
    router.push("/login");
  };

  const handleCountryChange = (selectedOption) => {
    setForm({ ...form, countryCode: selectedOption.code });
  };

  const passwordMatchError = form.repeat && form.password !== form.repeat;

  const FloatingLabelInput = ({ name, type = 'text', value, onChange, placeholder, error = false, toggleVisibility }) => (
    <div className="relative">
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={`peer w-full px-3 py-4 rounded-xl bg-[#1B263B] border ${error ? "border-red-500" : "border-[#415A77]"} text-white placeholder-transparent focus:outline-none focus:ring-1 focus:ring-[#08FDD8]`}
        required
      />
      <label
        className="absolute text-sm text-gray-400 left-3 top-2 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm"
        htmlFor={name}
      >
        {placeholder}
      </label>
      {toggleVisibility && (
        <div
          className="absolute top-1/2 right-3 z-40 transform -translate-y-1/2 cursor-pointer"
          onClick={toggleVisibility}
        >
          <Image
            src={type === 'password' ? "/icons/eye-closed.svg" : "/icons/eye.svg"}
            alt="toggle visibility"
            width={20}
            height={20}
          />
        </div>
      )}
    </div>
  );
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#101633] to-[#0f1a40] text-white px-4">
      <div className="w-full max-w-md space-y-6">
        {step === 1 && (
          <form onSubmit={handleFirstStep} className="space-y-4 p-6 bg-[#1f2944] rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-[#70c9d3]">Sign Up</h2>

            <div className="flex items-center gap-2">
              <div className="w-[125px]">
                <Select
                  options={countries.map(country => ({
                    label: `${country.flag} ${country.name} (${country.code})`,
                    value: country.value,
                    code: country.code
                  }))}
                  onChange={handleCountryChange}
                  placeholder="Country"
                  classNamePrefix="custom-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: '#1B263B',
                      borderColor: state.isFocused ? '#08FDD8' : '#415A77',
                      boxShadow: 'none',
                      borderRadius: '12px',
                      height: '58px',
                      minHeight: 'unset',
                      paddingInline: '12px'
                    }),
                    valueContainer: base => ({
                      ...base,
                      padding: 0,
                    }),
                    indicatorsContainer: base => ({
                      ...base,
                      padding: 0,
                    }),
                    singleValue: base => ({
                      ...base,
                      color: 'white',
                      fontSize: '14px'
                    }),
                    input: base => ({
                      ...base,
                      color: 'white',
                    }),
                    indicatorSeparator: () => ({
                      display: 'none'
                    }),
                    placeholder: base => ({
                      ...base,
                      color: '#ccc',
                      fontSize: '14px',
                    }),
                    menu: base => ({
                      ...base,
                      backgroundColor: '#1f2944',
                      zIndex: 9999
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? '#08FDD8' : '#415A77',
                      color: state.isFocused ? '#000' : '#fff',
                      cursor: 'pointer'
                    }),
                  }}
                />

              </div>
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="flex-1 px-3 py-4 rounded-xl bg-[#1B263B] border border-[#415A77] text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#08FDD8]"
                required
              />
            </div>

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-4 rounded-xl bg-[#1B263B] border border-[#415A77] text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#08FDD8]"
              required
            />

            <input
              name="repeat"
              type="password"
              placeholder="Repeat Password"
              value={form.repeat}
              onChange={handleChange}
              className={`w-full px-3 py-4 rounded-xl bg-[#1B263B] border ${passwordMatchError ? "border-red-500" : "border-[#415A77]"
                } text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[]`}
              required
            />
            {form.password && (
              <>
                <p className="text-xs mt-1 text-gray-300">
                  At least 8 characters + Special characters (!@#$%^&*)
                </p>

                <div className="flex items-center justify-between mt-1">
                  <div className="w-11/12 flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-[3px] rounded-xl transition-all duration-300 ${passwordStrength.score > i
                            ? passwordStrength.score <= 1
                              ? "bg-red-500"
                              : passwordStrength.score === 2
                                ? "bg-yellow-400"
                                : "bg-[#08FDD8]"
                            : "bg-gray-600"
                          }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`w-1/12 ml-2 text-xs font-medium ${passwordStrength.score === 0
                        ? "text-red-400"
                        : passwordStrength.score === 1
                          ? "text-yellow-400"
                          : "text-[#08FDD8]"
                      }`}
                  >
                    {passwordStrength.score === 0
                      ? "Weak"
                      : passwordStrength.score === 1
                        ? "So-so"
                        : "Good"}
                  </span>
                </div>
              </>
            )}

            {passwordMatchError && (
              <p className="text-red-400 text-sm">Passwords do not match</p>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}



            <button
              type="submit"
              className="w-full bg-[#00bcd4] text-white rounded-xl py-2 hover:bg-[#00a1b1] transition duration-200"
            >
              Continue
            </button>

            <div className="flex flex-col gap-2 pt-4">
              <button className="w-full flex items-center justify-center gap-2 border border-[#00bcd4] text-[#00bcd4] py-2 rounded-xl">
                <Image src="/icons/google-svgrepo-com-1.svg" alt="Google" width={20} height={20} />
                Sign Up with Google
              </button>
              <button className="w-full flex items-center justify-center gap-2 border border-white text-white py-2 rounded-xl">
                <Image src="/icons/apple-173-svgrepo-com-1.svg" alt="Apple" width={20} height={20} />
                Sign Up with Apple
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4 p-6 bg-[#1f2944] rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-[#70c9d3]">Name and Username</h2>
            <input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="w-full px-3 py-4 rounded-xl bg-[#2c3e50] text-white placeholder-gray-400"
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="w-full px-3 py-4 rounded-xl bg-[#2c3e50] text-white placeholder-gray-400"
              required
            />
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={(e) => {
                handleChange(e);
                handleCheckUsername(e.target.value);
              }}
              className="w-full px-3 py-4 rounded-xl bg-[#2c3e50] text-white placeholder-gray-400 border border-gray-600"
              required
            />
            {usernameError && <p className="text-red-400 text-sm">{usernameError}</p>}
            <button
              disabled={loading || usernameError}
              type="submit"
              className="w-full bg-[#9b59b6] text-white rounded-xl py-2 hover:bg-[#8e44ad] transition duration-200 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Finish Sign Up"}
            </button>
            <button
              onClick={() => setStep(1)}
              type="button"
              className="text-sm text-[#00bcd4] hover:underline text-center block mx-auto"
            >
              ← Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
