import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName:             { type: String, required: true },
    contactNumber:        { type: String, unique: true, sparse: true, default: undefined },
    email:                { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash:         { type: String, required: true, select: false },
    isEmailVerified:      { type: Boolean, default: false },
    providers:            { type: [String], enum: ["local", "google"], default: [] },
    role:                 { type: String, enum: ["user", "admin", "vendor"], default: "user" },
    twoFactorEnabled:     { type: Boolean, default: false },
    twoFactorSecret:      { type: String, select: false, default: undefined },
    tokenVersion:         { type: Number, default: 0 },
    resetPasswordToken:   { type: String, default: undefined },
    resetPasswordExpires: { type: Date, default: undefined },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (this.isModified("passwordHash")) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
