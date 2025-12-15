import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from '../context/AuthContext'
import UploadModal from '../components/UploadModal'

const Home = () => {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState("");
  const [loadingPrompt, setLoadingPrompt] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showWinner, setShowWinner] = useState(false)
  const hourNow = new Date().getHours()

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 21) {
      setShowWinner(true);
      const fetchWinner = async () => {
        try {
          const res = await api.get('/global/today-winner')
          setWinner(res.data)
        } catch (error) {
          console.log("No winner Yet")
        }
      }
      fetchWinner()
    }
  }, [])

  useEffect(() => {
    const fetChPrompt = async () => {
      try {
        const res = await api.get('/global/prompt');
        setPrompt(res.data.prompt)
      } catch (error) {
        console.log("Error fetching prompt")
      } finally {
        setLoadingPrompt(false)
      }
    }
    const fetchSubmissions = async () => {
      try {
        const res = await api.get('/global/today-submissions');
        setSubmissions(res.data)
      } catch (error) {
        console.log("Error fetching submissions")
      } finally {
        setLoadingSubs(false)
      }
    }
    fetChPrompt()
    fetchSubmissions()
  }, [])

  const refreshSubmission = async () => {
    const res = await api.get('/global/today-submissions');
    setSubmissions(res.data)
  }
  const handleVote = async (submissionId) => {
    try {
      await api.post(`/submission/vote/${submissionId}`)
      setSubmissions((prev) =>
        prev.map((item) =>
          item._id === submissionId
            ? {
              ...item,
              votes: item.votes + 1,
              voters: [...(item.voters || []), user._id],
            }
            : item
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update vote")
    }
  }

  const hasSubmitted = submissions.some((item) =>
    item.userId?._id == user._id
  )

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      {hourNow < 21 && (
        <div className="max-w-4xl mx-auto mb-6 bg-blue-50 border border-blue-200 rounded p-4 text-center">
          <p className="text-blue-700 font-medium">
            ⏰ Winners will be announced after <span className="font-semibold">9:00 PM</span>
          </p>
        </div>
      )}

      {showWinner && winner && (
        <div className="max-w-4xl mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded shadow p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">🏆 Today’s Global Winner</h2>

          <img
            src={winner.imageUrl}
            alt="winner"
            className="w-full h-64 object-cover rounded mb-4"
          />

          <p className="text-lg font-semibold">
            {winner.userId?.username}
          </p>

          <p className="text-sm">
            {winner.votes} votes
          </p>
        </div>
      )}


      {/* PROMPT */}
      <div className="max-w-4xl mx-auto bg-white rounded shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Today’s Global Prompt</h2>
        {loadingPrompt ? (
          <p className="text-gray-400">Loading prompt...</p>
        ) : (
          <p className="text-gray-700">{prompt}</p>
        )}

        <button
          onClick={() => setShowUpload(true)}
          disabled={hasSubmitted}
          className={`mt-4 px-4 py-2 rounded 
            ${hasSubmitted
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
            }
          `}
        >
          {hasSubmitted ? "Already submitted for today's contest" : "Upload Your Photo"}
        </button>

      </div>

      {/* SUBMISSIONS */}
      <div className="max-w-6xl mx-auto">
        <h3 className="text-lg font-semibold mb-4">Today’s Submissions</h3>

        {loadingSubs ? (
          <p className="text-gray-400">Loading submissions...</p>
        ) : submissions.length === 0 ? (
          <p className="text-gray-500">No submissions yet. Be the first!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {submissions.map((item) => {
              const hasVoted = item.voters?.includes(user?._id);
              const isOwnPost = item.userId?._id === user?._id;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded shadow overflow-hidden"
                >
                  <img
                    src={item.imageUrl}
                    alt="submission"
                    className="w-full h-60 object-cover"
                  />

                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      by{" "}
                      <span className="font-medium">
                        {item.userId?.username || "Anonymous"}
                      </span>
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">{item.votes} votes</span>

                      <button
                        disabled={hasVoted || isOwnPost}
                        onClick={() => handleVote(item._id)}
                        className={`text-sm px-3 py-1 border rounded 
                              ${hasVoted || isOwnPost
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-black hover:text-white"}
                          `}
                      >
                        {isOwnPost ? "Your Post" : hasVoted ? "Voted" : "Vote"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        )}
      </div>
      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onSuccess={refreshSubmission}
        prompt={prompt}
      />
    </div>
  );
};

export default Home;
