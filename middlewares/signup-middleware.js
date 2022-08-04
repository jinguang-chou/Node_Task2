const Joi = require("joi");

module.exports = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object().keys({
    nickname: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{4,30}$"))
        .required(),
    confirm: Joi.ref("password"),
    })

try {// 검사시작
    await schema.validateAsync(body);
} catch (err) {// 유효성 검사 에러
    return res.status(400).json({ code: 400, message: "회원가입 조건을 확인하세요." });
}
next();
}