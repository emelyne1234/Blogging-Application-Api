import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv'

dotenv.config()
const { cloud_name, api_key, api_key_secret } = process.env;

cloudinary.config({ 
    cloud_name: cloud_name, 
    api_key: api_key, 
    api_secret: api_key_secret 
  });

export default cloudinary;