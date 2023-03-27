import mongoose from "mongoose";
import slugify from "slugify";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: [true, 'The name already exists'],
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    cash: {
      type: Number,
      default: [0],
      require: true,
    },
    credit: {
      type: Number,
      default: [0],
      min: 0,
      require: true,
    },
    accounts: {
      type: [String],
      require:true,
      default: []
    },
    isActive:{
      type: Boolean,
      default:true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      virtuals: true,
      // Hide the _id and the __v field from the frontend
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      // Hide the _id and the __v field from the frontend
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Middleware - Create slug from name
UserSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});


export default mongoose.model("User", UserSchema);
