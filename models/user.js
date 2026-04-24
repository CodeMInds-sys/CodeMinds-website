const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        minlength: [3, 'name must be at least 3 characters long'],
        trim: true
    },
    email: {
        type: String,
        required: [false, 'email is required'],
        unique: true,
        trim: true,
        sparse: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'email is invalid']
    },



    phone: {
  type: String,
  required: [true, 'phone is required'],
  trim: true,
  validate: {
    validator: function (value) {
      return /^(01[0-2,5][0-9]{8}|05[0-9]{8})$/.test(value);
    },
    message: 'phone is invalid',
  },
},
    password: {
        type: String,
        minlength: [8, 'password must be at least 8 characters long'],
        required: [true, 'password is required']
    },
    role: {
        type: String,
        enum: ['user','student', 'instructor', 'manager', 'admin'],
        default: 'user'
    },
    authToken: String,
    profileRef:{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'profileModel'
    },
    profileModel:{
        type: String,
        enum: ['Student', 'Instructor', 'Manager', 'Admin'],
        default:null
    },
    history:{
        type: Array,
        default: []
    },
    resetPasswordTokenUsed: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    avatar: {
        type: String
    },


}, {
    timestamps: true
});




function normalizePhone(input) {
  if (!input) return null;

  // 1. شيل أي حاجة مش رقم
  let phone = input.replace(/\D/g, "");

  // ======================
  // 🇪🇬 مصر
  // ======================
  if (phone.startsWith("20")) {
    phone = "0" + phone.slice(2);
  }

  if (phone.startsWith("1") && phone.length === 10) {
    phone = "0" + phone;
  }

  // تحقق مصري
  if (/^01[0-25][0-9]{8}$/.test(phone)) {
    return phone;
  }

  // ======================
  // 🇸🇦 السعودية
  // ======================
  if (phone.startsWith("966")) {
    phone = "0" + phone.slice(3);
  }

  if (phone.startsWith("5") && phone.length === 9) {
    phone = "0" + phone;
  }

  // تحقق سعودي
  if (/^05[0-9]{8}$/.test(phone)) {
    return phone;
  }

  // ❌ لو مش مطابق لأي دولة
  return null;
}


// // حذف الـ index القديم عند تشغيل التطبيق
// userSchema.pre('save', async function() {
//     try {
//         await this.collection.dropIndex('email_1');
//     } catch (error) {
//         // تجاهل الخطأ إذا لم يكن الـ index موجوداً
//     }
// });

userSchema.pre("save", async function (next) {
    
  await this.collection.dropIndex('email_1');
  if (this.phone) {
    this.phone = normalizePhone(this.phone);
  }
  next();
});

// compare password 
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};




const User = mongoose.model("User", userSchema);

module.exports = User;

