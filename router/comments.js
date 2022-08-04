const express = require("express");
const { User, Post, Comment } = require("../models");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

router.post("/comments/:postId", authMiddleware, async (req, res) => { // 댓글 생성
    const { postId } = req.params;
    const { comment } = req.body;
    const { userId } = res.locals.user;

    const user = await User.findOne({where: {userId} });

    if(!comment){
        return res.status(400).json({ success: false, errorMessage: "댓글 내용을 입력해주세요" })
    }else{
        await Comment.create({ userId: userId, nickname: user.nickname, postId: Number(postId), comment })
        return res.json({ success: true , message: "댓글을 작성하였습니다."})
    };
    
});

router.get("/comments/:postId", async (req, res) => {// 댓글 조회 // 수정 필요 postId에 맞게 나오게
    const { postId } = req.params;
    const data = await Comment.findAll({ where: {postId}, 
        attributes: ["commentId","userId","nickname","comment","createdAt","updatedAt"],
        order: [['createdAt', 'desc']],
    });
    res.json({ 
        data, 
    });
});

router.put("/comments/:commentId", authMiddleware, async (req, res) => { // 댓글 수정
    const { commentId } = req.params;
    const { comment } = req.body; 

    const Check_comment = await Comment.findOne({ where:{ commentId: Number(commentId) }});
 
    if(!Check_comment) {
        return res.status(400).json({ success: false, errorMessage: "존재 하지 않는 댓글입니다."});
    }else if(!comment){
        return res.status(400).json({ success: false, errorMessage: "댓글 내용이 없습니다."});
    }else{
        await Comment.update( { comment: comment },{ where:{ commentId: Number(commentId) }})
        res.json({ success: true, Message: "댓글을 수정 했습니다." });
    };
});

router.delete("/comments/:commentId", authMiddleware, async (req, res) => { // 댓글 삭제 
    const { commentId } = req.params;
  
    const comment = await Comment.findOne({ where:{ commentId: Number(commentId) }});
    if  (comment.length > 0) {
      await Comment.destroy({where: { commentId: Number(commentId)}});
      return res.json({ success: true, Message: "댓글을 삭제하였습니다." });
    }
    res.status(400).json({ success: true, Message: "댓글이 없습니다." });
});

module.exports = router;