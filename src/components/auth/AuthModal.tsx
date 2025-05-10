import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "signin" | "signup";
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode,
}) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); // For SignUp
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Simulated credentials for login and signup
  const users = [
    {
      email: "user@example.com",
      password: "password123", // This should be hashed in a real app
      fullName: "John Doe",
    },
  ];

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Reset error message

    if (mode === "signin") {
      // Simulate login process
      const user = users.find(
        (user) => user.email === email && user.password === password
      );
      if (user) {
        setLoading(false);
        alert("Login Successful!");
        onClose(); // Close modal on successful login
      } else {
        setLoading(false);
        setErrorMessage("Invalid email or password.");
      }
    } else {
      // Simulate sign up process
      const userExists = users.some((user) => user.email === email);
      if (userExists) {
        setLoading(false);
        setErrorMessage("Email already exists.");
      } else {
        users.push({ email, password, fullName });
        setLoading(false);
        alert("Account created successfully!");
        onClose(); // Close modal on successful signup
      }
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[1000]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 text-left align-middle shadow-xl transition-all">
                <div className="mb-8">
                  <div className="flex justify-between items-center">
                    <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {mode === "signin" ? "Welcome Back" : "Create Account"}
                    </Dialog.Title>
                    <div className="text-sm">
                      <span className="text-gray-500">
                        {mode === "signin"
                          ? "New here? "
                          : "Already have an account? "}
                      </span>
                      <button
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        onClick={() =>
                          setMode(mode === "signin" ? "signup" : "signin")
                        }
                      >
                        {mode === "signin" ? "Sign Up" : "Sign In"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {mode === "signup" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {mode === "signin" ? "Sign In" : "Create Account"}
                  </button>

                  {errorMessage && (
                    <div className="text-red-600 text-center mt-4">
                      {errorMessage}
                    </div>
                  )}

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gradient-to-br from-white to-gray-50 text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <button className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AuthModal;
