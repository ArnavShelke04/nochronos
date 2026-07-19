import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; // Imported jwt to handle token generation methods below
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ]
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false 
  },

  // --- Added Refresh Token Property Below ---
  refreshToken: {
    type: String,
    select: false // Keeps it hidden from ordinary find queries out of the box
  },

  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80' 
  },

  preferredCurrency: {
    type: String,
    enum: ["USD", "EUR", "GBP", "INR"],
    default: "USD"
  },

  joinedPools: [{
    type: Schema.Types.ObjectId,
    ref: 'Pool',
    default : null
  }],

  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true 
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return ;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Methods to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  // If password field is marked select: false, this.password won't exist 
  // unless you explicitly selected it in your controller query (.select("+password"))
  return bcrypt.compare(candidatePassword, this.password);
};

// --- Added Native Token Generation Methods ---
userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m'
    }
  );
};

userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d'
    }
  );
};

// Safe formatting for JSON outputs
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.refreshToken; // Added so the refresh token never accidentally spills to the client body
    delete ret.__v;
    return ret;
  }
});

export const User = mongoose.model('User', userSchema);