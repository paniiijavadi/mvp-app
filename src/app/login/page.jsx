'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const savedUser = JSON.parse(localStorage.getItem("user"));
  
    if (!savedUser) {
      alert("هیچ کاربری ثبت‌نام نکرده!");
      return;
    }
  
    if (
      form.username === savedUser.phone &&
      form.password === savedUser.password
    ) {
      localStorage.setItem("loggedIn", "true");
      alert("ورود موفقیت‌آمیز بود ✅");
      window.location.href = "/";
    } else {
      alert("شماره یا رمز عبور اشتباه است ❌");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#101633] to-[#1b1f3a] text-white px-4">
      <div className="w-full max-w-md space-y-6">

        {/* لوگو و خوش‌آمد */}
        <div className="text-center space-y-2">
          <div className="text-4xl">🌌</div>
          <h1 className="text-xl font-semibold">Welcome back!</h1>
        </div>

        {/* فرم ورود */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username / Phone Number"
            value={form.username}
            onChange={handleChange}
            className="w-full bg-[#1f2944] px-3 py-2 rounded outline-none text-sm"
            required
          />

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-[#1f2944] px-3 py-2 rounded outline-none text-sm pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>

          {/* فراموشی رمز */}
          <div className="text-right text-xs">
            <a href="#" className="text-cyan-400 hover:underline">Forgot Password</a>
          </div>

          {/* دکمه ورود */}
          <button
            type="submit"
            className="w-full py-2 rounded bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90"
          >
            Login
          </button>

          {/* یا */}
          <div className="text-center text-sm text-gray-400">Or</div>

          {/* ورود با گوگل و اپل */}
          <div className="space-y-2">
            <button className="w-full border border-cyan-400 rounded py-2 flex justify-center items-center space-x-2 hover:bg-cyan-500/20">
              <Image src="/google.svg" alt="Google" width={18} height={18} />
              <span className="text-sm">Sign in with Google</span>
            </button>
            <button className="w-full border border-white/40 rounded py-2 flex justify-center items-center space-x-2 hover:bg-white/10">
              <Image src="/apple.svg" alt="Apple" width={18} height={18} />
              <span className="text-sm">Sign in with Apple</span>
            </button>
          </div>

          {/* لینک ثبت‌نام */}
          <p className="text-xs text-center">
            Not a member? <Link href="/signup" className="text-cyan-400 hover:underline">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
