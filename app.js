const express = require("express");
const { User } = require("./models");//index 생략.user의 경로
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/auth-middleware");
const signupMiddleware = require("./middlewares/signup-middleware");
// const { Op } = require("sequelize");

const app = express();
const router = express.Router();
const port = 3000;


app.use(express.json());// joon으로 값을 가져옴 body 값을 쓰려면 필수
const commentsRouter = require("./router/comments")
const postsRouter = require("./router/posts");

app.use("/api", [ postsRouter, commentsRouter ]);


router.post("/signup", signupMiddleware, async (req, res) => { //회원가입
  const { nickname, password, confirm } = req.body;

  if(password !== confirm){
    res.status(400).send( {errorMessage: "패스워드가 패스워드 확인란과 다릅니다."},)
    return;
  };
  if(password.includes(nickname)){
    res.status(400).json( {errorMessage: "회원가입 조건을 확인하세요."},)
    return;
  };

  const existsUsers = await User.findAll({ where: { nickname } });   
    if (existsUsers.length) {
        return res.status(400).send({ success: false, errorMessage: "중복된 닉네임입니다." });
    };

  await User.create({ nickname, password });
  
  res.status(201).send({ message : "회원 가입에 성공하였습니다." });

});

router.post("/login", async (req, res) => { //로그인
    const { nickname, password } = req.body;

    const user = await User.findOne({ where: { nickname, password } });

    if (!user) {//|| password !== user.password
      res.status(401).send({
        errorMessage: "닉네임 또는 패스워드가 틀렸습니다.",
      });
      return;
    }   
    const token = jwt.sign({ userId: user.userId }, "jinguang")

    res.send({
      token,
    });
});



router.get("/login/me", authMiddleware, async (req, res) => {  //로그인 상태 구현
    const { user } = res.locals
    res.send({ user: { nickname: user.nickname } });
});// authMiddleware, 이걸 붙이기만 해도 토큰이 로그인 해서 있는지 검사.


app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.static("assets"));

app.use("/api", express.json(), router);// router

app.listen(port, () => {
  console.log(port, "서버가 켜졌어요!");
});

