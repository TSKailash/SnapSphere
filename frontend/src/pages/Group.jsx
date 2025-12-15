import React from 'react'
import {useState, useEffect} from 'react'
import api from '../services/api'
import {Link} from 'react-router-dom'
import CreateGroupModal from '../components/CreateGroupModal'
import JoinGroupModal from '../components/JoinGroupModal'

const Group = () => {
  const [loading, setLoading]=useState(true)
  const [groups, setGroups]=useState([])
  const [showCreate, setShowCreate]=useState(false)
  const [showJoin, setShowJoin]=useState(false)

  useEffect(()=>{
    const fetchGroups=async()=>{
      try {
        const res=await api.get('/group/getGroups')
        setGroups(res.data.groups)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchGroups()
  }, [])

  const refreshGroups=async()=>{
    const res=await api.get('/group/getGroups')    
    setGroups(res.data)
    // console.log("Groups state:", groups);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Groups</h2>

          <div className="flex gap-3">
            <button 
            onClick={()=>setShowCreate(true)}
            className="px-4 py-2 bg-black text-white rounded">
              Create Group
            </button>
            <button className="px-4 py-2 border rounded"
              onClick={()=>setShowJoin(true)}
            >
              Join Group
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading groups...</p>
        ) : groups?.length === 0 ? (
          <p className="text-gray-500">
            You haven’t joined any groups yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.isArray(groups) && groups.map((group) => (
              <Link
                key={group._id}
                to={`/groups/${group._id}`}
                className="bg-white p-4 rounded shadow hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">
                  {group.groupName}
                </h3>
                <p className="text-sm text-gray-600">
                  Code: {group.groupCode}
                </p>
                <p className="text-sm mt-2">
                  Members: {group.members.length}
                </p>
              </Link>
            ))}
          </div>
        )}
        <CreateGroupModal
          isOpen={showCreate}
          onClose={()=>setShowCreate(false)}
          onSuccess={refreshGroups}
        />
        <JoinGroupModal
          isOpen={showJoin}
          onClose={()=>setShowJoin(false)}
          onSuccess={refreshGroups}
        />
      </div>
    </div>
  );
}

export default Group
