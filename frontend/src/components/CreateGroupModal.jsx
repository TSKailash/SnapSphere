import { useState, useEffect } from "react"
import api from "../services/api"

const createGroupModal = ({isOpen, onClose, onSuccess}) => {
  const [groupName, setGroupName]=useState("")
  const [loading, setLoading]=useState(false)
  const [error, setError]=useState("")
  
  if(!isOpen) return;

  const handleCreate=async()=>{
    if(!groupName.trim()){
        setError("Group name is necessary")
        return;
    }
    try {
        setLoading(true)
        await api.post('/group/create-group', {groupName});
        onSuccess();
        onClose();
    } catch (error) {
        setError(error.response?.data?.message || "Failed to create group")
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Create Group</h2>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <input
          type="text"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
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
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default createGroupModal
