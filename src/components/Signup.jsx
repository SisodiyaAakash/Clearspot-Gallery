import React, { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const googleProvider = new GoogleAuthProvider();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/gallery");
        } catch (err) {
            setError("Failed to create an account. Please try again.");
        }
    };

    const handleGoogleSignup = async () => {
        setError("");
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/gallery");
        } catch (err) {
            setError("Google Signup failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-green-400 to-teal-600 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Create an Account
                </h1>
                {error && (
                    <p className="text-red-500 text-center bg-red-100 p-2 rounded mb-4">
                        {error}
                    </p>
                )}
                <form onSubmit={handleSignup}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="flex items-center border rounded-lg px-3">
                            <AiOutlineMail className="text-gray-400 mr-2" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full py-2 outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="flex items-center border rounded-lg px-3">
                            <AiOutlineLock className="text-gray-400 mr-2" />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full py-2 outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition-all mb-4"
                    >
                        Sign Up
                    </button>
                </form>
                <button
                    onClick={handleGoogleSignup}
                    className="w-full flex items-center justify-center bg-gray-100 border py-3 rounded-lg hover:bg-gray-200 transition-all"
                >
                    <FcGoogle className="text-2xl mr-2" />
                    Sign Up with Google
                </button>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{" "}
                    <Link to="/" className="text-teal-500 hover:underline font-semibold">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
