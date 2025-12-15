import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      
      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">
          SnapSphere
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          A daily photo competition platform where creativity meets community.
          Compete globally or within private groups using daily prompts.
        </p>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 border border-black rounded hover:bg-black hover:text-white"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* WHAT IS SNAPSPHERE */}
      <section className="px-6 py-20 bg-gray-50 text-center">
        <h2 className="text-3xl font-semibold mb-6">
          What is SnapSphere?
        </h2>
        <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
          SnapSphere is a social photo challenge platform where users receive
          daily prompts and upload photos based on creativity. Users can compete
          globally with everyone on the platform or privately within groups of
          friends. Votes decide winners every day.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-20">
        <h2 className="text-3xl font-semibold text-center mb-12">
          How it Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto text-center">
          <div>
            <h3 className="text-xl font-semibold mb-3">Daily Prompts</h3>
            <p className="text-gray-600">
              Every day, you receive a unique photo prompt — globally and inside
              your groups.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Upload & Vote</h3>
            <p className="text-gray-600">
              Upload your photo based on the prompt and vote for the best
              submissions from others.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Win & Compete</h3>
            <p className="text-gray-600">
              Winners are announced daily, points are awarded, and leaderboards
              keep the competition alive.
            </p>
          </div>
        </div>
      </section>

      {/* WHY SNAPSPHERE */}
      <section className="px-6 py-20 bg-gray-50">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Why SnapSphere?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
          <div>
            <p className="font-medium">🌍 Global Challenges</p>
          </div>
          <div>
            <p className="font-medium">👥 Private Group Competitions</p>
          </div>
          <div>
            <p className="font-medium">🏆 Daily Winners & Leaderboards</p>
          </div>
          <div>
            <p className="font-medium">⚡ Simple, Fun & Competitive</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to Join the Challenge?
        </h2>
        <p className="text-gray-600 mb-8">
          Create an account and start competing today.
        </p>

        <Link
          to="/register"
          className="px-8 py-3 bg-black text-white rounded hover:bg-gray-800"
        >
          Create Account
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} SnapSphere. Built with ❤️
      </footer>
    </div>
  );
};

export default Landing;
