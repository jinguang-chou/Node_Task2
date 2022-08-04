const express = require("express");
const { User, Post, Comment, Like } = require("../models");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

router.post("/posts", authMiddleware, async (req, res) => { // 게시글 생성하기
	const { title, content } = req.body;
    const { userId } = res.locals.user;

    const user = await User.findOne({where: {userId: Number(userId)} });

  const createdPosts = await Post
  .create({ userId: userId, nickname: user.nickname, title, content, likes:0 });

  res.json({ posts: createdPosts, Message: "게시글 작성에 성공하였습니다."});// posts: createdPosts, 를 지움?? json은 데이터를 가져오기??
});

router.get("/posts", async (req, res) => {//게시물 조회  아직 추가 (likes)
    const data = await Post.findAll({
        attributes: ["postId","userId","nickname","title","createdAt","updatedAt","likes"],
        order: [['createdAt', 'desc']],
    })
    res.json({ 
      data, 
    });
});
 
router.get("/posts/:postId", async (req, res) => { // 게시물 상세 조회 추가 (likes)
    const { postId } = req.params;
    console.log( postId)
    const data = await Post.findOne({where: { postId: Number(postId)}});
    if(!data) {
        return res.status(400).json({ success: false, errorMessage: "게시글이 없습니다."});
    }

    res.json({
        data,
    });
});

router.put("/posts/:postId", authMiddleware, async (req, res) =>  { // 게시판 수정 (제목과 내용)
    const { postId } = req.params;                 
    const { title, content } = req.body; 
    const post = await Post.findOne({where: { postId: Number(postId)}});
    if(!post) {
        return res.status(400).json({ success: false, errorMessage: "게시글이 없습니다."});
    }else if(!title || !content){
        return res.status(400).json({ success: false, errorMessage: "제목이나 내용이 없습니다."});
    }else{
        await Post.update({ title: title, content: content }, {where: { postId: Number(postId)}});
        res.json({ success: true, Message: "게시글을 수정하였습니다." });
    };
    
});

router.delete("/posts/:postId", authMiddleware, async (req, res) =>  {//제거 api 특정 주소의 이런 값이 있는 내용의 데이터 지우기
    const { postId } = req.params;
  
    const post = await Post.findOne({where: { postId: Number(postId)}});

    if(!post) {
        return res.status(400).json({ success: false, errorMessage: "게시글이 없습니다."});
    }else {
        await Post.destroy({where: { postId: Number(postId)}});
        res.json({ success: true , Message: "게시글을 삭제하였습니다." });
    };
});
  
router.get("/posts_like",authMiddleware, async (req, res) => { //좋아요 게시글 조회
    const { userId } = res.locals.user;
    //   await Post.findOne({where: { postId: Number(postId)}});
    console.log( { userId })
    const likes_List = await Like.findAll({where: { userId },
        
        attributes: ["postId"],
        order: [['likes', 'desc']],
    });
    const list = [];
    console.log({postId:likes_List[1].postId})
    for(let i=0; i < likes_List.length; i++){
        let post = await Post.findOne({where:{postId:likes_List[i].postId}})
        list.push(post) 
        
    }
    res.json({
        list,
    });
});

router.put("/posts_like/:postId", authMiddleware, async (req, res)=> {//게시글에 Id에 좋아요을 누르면 1올라가게
    const { postId } = req.params;
    const { userId } = res.locals.user;
    
    const postlike = await Like.findOne({where: { postId,userId }});
    if(!postlike) {
        const like = await Like.findAll({where: { postId }});
        await Like.create({ postId,userId,likes:like.length+1 });
        await Post.update({ likes: like.length+1 }, {where: { postId }});
        return res.json({ success: false, Message: "게시글의 좋아요를 등록하였습니다."});
    }else{
        const like = await Like.findAll({where: { postId }});
        await Like.destroy({where: {  postId,userId }});
        await Post.update({ likes: like.length+1 }, {where: { postId }});
        return res.json({ success: false, Message: "게시글의 좋아요를 최소하였습니다."});
    }

});

module.exports = router;