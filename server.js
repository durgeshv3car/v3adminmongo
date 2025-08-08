const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors()); // ✅ enable CORS for all origins

// app.use(cors({
//   origin: ['https://your-frontend.com', 'http://localhost:3000']
// }));

// Optionally add more control:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const bannerRoutes = require('./routes/bannerRoutes');

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/slider', require('./routes/create_sliderRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/variants', require('./routes/variantRoutes'));
app.use('/api/countries', require('./routes/countryRoutes'));
app.use('/api/brands', require('./routes/brandRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/banners', bannerRoutes);
app.use('/api/reviews', require('./routes/reviewRoutes'));



// Image Upload
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/uploads', express.static('uploads')); // Serve images


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));