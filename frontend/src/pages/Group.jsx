import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import CreateGroupModal from '../components/CreateGroupModal';
import JoinGroupModal from '../components/JoinGroupModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Hash, ChevronRight, LayoutGrid, UserPlus } from 'lucide-react';

const Group = () => {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await api.get('/group/getGroups');
      setGroups(res.data.groups);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const refreshGroups = async () => {
    const res = await api.get('/group/getGroups');
    setGroups(res.data.groups || res.data); // Adjust based on your API response structure
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-yellow-400 font-bold tracking-widest text-xs uppercase">
              <Users size={14} /> Private Spheres
            </div>
            <h2 className="text-5xl font-black tracking-tighter italic">MY GROUPS</h2>
          </div>

          <div className="flex gap-3">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowJoin(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-colors"
            >
              <UserPlus size={18} /> Join
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FFFC00] text-black text-sm font-black transition-all shadow-[0_0_20px_rgba(255,252,0,0.2)]"
            >
              <Plus size={18} strokeWidth={3} /> Create New
            </motion.button>
          </div>
        </header>

        {/* GROUPS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-white/5 animate-pulse rounded-[32px]" />
            ))}
          </div>
        ) : groups?.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/10 rounded-[40px] text-center"
          >
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <LayoutGrid className="text-gray-600" size={32} />
            </div>
            <p className="text-gray-500 font-medium max-w-xs">
              No active spheres yet. Create a group to start a private daily competition.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {Array.isArray(groups) && groups.map((group, index) => (
                <motion.div
                  key={group._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Link
                    to={`/groups/${group._id}`}
                    className="group relative block bg-[#111] p-8 rounded-[32px] border border-white/5 hover:border-yellow-400/50 transition-all duration-300 overflow-hidden"
                  >
                    {/* Background Graphic */}
                    <div className="absolute -right-4 -top-4 text-white/[0.02] rotate-12 group-hover:text-yellow-400/[0.05] transition-colors">
                      <Users size={140} />
                    </div>

                    <div className="relative z-10 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-[#FFFC00] group-hover:text-black transition-colors">
                          <Users size={20} />
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-colors">
                          <Hash size={10} /> {group.groupCode}
                        </div>
                      </div>

                      <h3 className="text-2xl font-black mb-2 tracking-tighter group-hover:text-[#FFFC00] transition-colors">
                        {group.groupName}
                      </h3>
                      
                      <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                        <span className="text-sm font-medium text-gray-500">
                          <span className="text-white font-bold">{group.members.length}</span> Members
                        </span>
                        <div className="p-2 bg-white/5 rounded-full group-hover:translate-x-1 transition-transform">
                          <ChevronRight size={18} className="text-gray-400 group-hover:text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* MODALS */}
        <CreateGroupModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          onSuccess={refreshGroups}
        />
        <JoinGroupModal
          isOpen={showJoin}
          onClose={() => setShowJoin(false)}
          onSuccess={refreshGroups}
        />
      </div>
    </div>
  );
};

export default Group;