// const mongoose = require("mongoose");

// const commentSchema = new mongoose.Schema({
//   postId: { //대응 된 post의 주소
//     type: Number,
//     required: true,
//   },
//   commentId: { // comment의 주소
//     type: Number,
//     required: true,
//     unique: true,
//   },
//   comment: { // 댓글 내용
//     type: String,
//     required: true,
//   },
//   createdAt: { // 생성 시간
//     type: Date,
//     default: Date.now,
//     required: true,
//   },
//   updatedAt: { // 수정 시간
//     type: Date,
//     default: Date.now,
//     required: true,
//   },
// });

// module.exports = mongoose.model("Comment", commentSchema);