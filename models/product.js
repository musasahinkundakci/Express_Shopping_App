const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Ürün ismi girmelisiniz!"],
    minlength: [5, "Ürün ismi için en az 5 karakter giriniz!"],
  },
  price: {
    type: Number,
    required: function () {
      return this.isActive;
    },
  },
  description: String,
  image: String,
  date: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
  // tags: {
  //   type: Array,
  //   validate: {
  //     validator: function (value) {
  //       return value && value.length > 0;
  //     },
  //     message: "Ürün için en az bir etiket giriniz",
  //   },
  // },
  isActive: Boolean,
});
module.exports = mongoose.model("Product", productSchema);
