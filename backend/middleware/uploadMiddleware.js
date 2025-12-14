import multer from 'multer'
import pkg from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js'

const { CloudinaryStorage } = pkg;

const storage=new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "snapsphere",
        allowedFormats: ["jpg", "jpeg", "png"]
    },
})

const upload=multer({storage})

export default upload