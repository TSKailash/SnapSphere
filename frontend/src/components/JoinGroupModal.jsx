import React from 'react'
import {useState, useEffect} from 'react'
import api from '../services/api'

const JoinGroupModal = ({isOpen, onClose, onSuccess}) => {
  const [groupCode, setGroupCode]=useState("")
  const [loading, setLoading]=useState(false)
  const [error, setError]=useState("")

  if(!isOpen) return;

  const handleCreate=async()=>{
    try {
        setLoading(true)
        await api.post('/group/join', {groupCode})
        onSuccess()
        onClose()
    } catch (error) {
        setError(error.response?.data?.message || "Failed to join group")
        console.log(error.response?.data?.message || "Failed to join group")
    } finally {
        setLoading(false)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Join Group</h2>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <input
          type="text"
          placeholder="Enter group code"
          value={groupCode}
          onChange={(e) => setGroupCode(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            {loading ? "Joining..." : "Join"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default JoinGroupModal
