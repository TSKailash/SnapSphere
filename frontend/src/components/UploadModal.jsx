import React from 'react'
import { useState } from 'react'
import api from '../services/api'

const UploadModal = ({isOpen, onClose, onSuccess, prompt}) => {
  const [image, setImage]=useState(null)
  const [preview, setPreview]=useState(null)
  const [loading, setLoading]=useState(false)
  const [error, setError]=useState("")

  if(!isOpen) return null;
  const handleFileChange=(e)=>{
    const file=e.target.files[0];
    if(!file) return;
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setError("")
  };

  const handleSubmit=async()=>{
    if(!image){
        setError("Please upload an image")
        return;
    }
    const formData=new FormData();
    formData.append("image", image)
    formData.append("prompt", prompt)
    formData.append("isGlobal", "true")

    try {
        setLoading(true);
        const res=await api.post('/submission/upload', formData, {
            headers: {"Content-Type": "multipart/form-data"}
        })
        console.log(res.data.message)
        onSuccess();
        onClose();
    } catch (error) {
        setError(error.response?.data?.message || "Upload failed");
    } finally {
        setLoading(false)
    }

  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-2">Upload Your Photo</h2>
        <p className="text-sm text-gray-600 mb-4">{prompt}</p>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-48 object-cover rounded mb-4"
          />
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadModal
