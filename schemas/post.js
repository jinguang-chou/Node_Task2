// const mongoose = require("mongoose");

// const postSchema = new mongoose.Schema({
//   postId: { //구분할 ID
//     type: Number,
//     required: true,
//     unique: true,
//   },
//   title: { // 제목
//     type: String,
//     required: true,
//   },
//   content: { //게시글를 내용
//     type: String,
//     required: true,
//   },
//   createdAt: { // 만들어진 날짜
//     type: Date,
//     default: Date.now,
//     required: true,
//   },
//   updatedAt: { // 수정 날짜
//     type: Date,
//     default: Date.now,
//     required: true,
//   },
// });

// module.exports = mongoose.model("Post", postSchema);