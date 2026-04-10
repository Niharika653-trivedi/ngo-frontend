import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const images = [
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2064&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop",
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bgIndex, setBgIndex] = useState(0);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setBgIndex((v) => (v + 1) % images.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      if (isRegisterMode) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Request failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <section
        className="relative flex items-end overflow-hidden p-10 text-white"
        style={{ backgroundImage: `url(${images[bgIndex]})`, backgroundSize: "cover" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative max-w-lg space-y-4">
          <h1 className="text-5xl font-bold">Atmadeepam Society</h1>
          <h2 className="text-3xl font-semibold">Empowering Vision Beyond Sight</h2>
          <p className="text-lg">Empowering visually impaired individuals through technology, education, and care.</p>
        </div>
      </section>
      <section className="flex items-center justify-center bg-[#e9eee7] p-6">
        <div className="glass-card w-full max-w-md rounded-3xl border border-white/60 p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900">
            {isRegisterMode ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="mt-1 text-gray-600">
            {isRegisterMode ? "Create your NGO CRM access" : "Access your NGO CRM dashboard"}
          </p>
          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            {isRegisterMode && (
              <>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  aria-label="full name"
                  type="text"
                  required
                  className="w-full rounded-md border p-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </>
            )}
            <label className="block text-sm font-medium">Email Address</label>
            <input aria-label="email address" type="email" required className="w-full rounded-md border p-3" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Password</label>
              <button type="button" className="text-sm text-ngo-700">Forgot password?</button>
            </div>
            <input aria-label="password" type="password" required className="w-full rounded-md border p-3" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="rounded bg-red-100 p-2 text-sm text-red-700">{error}</p>}
            <button disabled={isSubmitting} className="w-full rounded-md bg-ngo-700 py-3 font-semibold text-white hover:bg-ngo-900 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? "Please wait..." : isRegisterMode ? "Create Account" : "Sign In"}
            </button>
            <button type="button" className="w-full rounded-md border py-3 font-semibold">Sign in with Google</button>
            <p className="text-center text-sm">
              {isRegisterMode ? "Already have an account?" : "New to our foundation?"}{" "}
              <button
                type="button"
                className="text-ngo-700 underline"
                onClick={() => {
                  setIsRegisterMode((v) => !v);
                  setError("");
                }}
              >
                {isRegisterMode ? "Sign In" : "Create Account"}
              </button>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
