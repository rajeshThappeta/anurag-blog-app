import exp from "express";
import { authenticate, register } from "../services/authService.js";
import { UserTypeModel } from "../models/UserModel.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { checkAuthor } from "../middlewares/checkAuthor.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const authorRoute = exp.Router();

//Register author(public)
authorRoute.post("/users", async (req, res) => {
  //get user obj from req
  let userObj = req.body;
  //call register
  const newUserObj = await register({ ...userObj, role: "AUTHOR" });
  //send res
  res.status(201).json({ message: "authroe created", payload: newUserObj });
});


//Create article(protected route)
authorRoute.post("/articles",verifyToken ,checkAuthor, async (req, res) => {
  //get article from req
  let article = req.body;

  //create article document
  let newArticleDoc = new ArticleModel(article);
  //save
  let createdArticleDoc = await newArticleDoc.save();
  //send res
  res.status(201).json({ message: "article created", payload: createdArticleDoc });
});

//Read artiles of author(protected route)
authorRoute.get("/articles/:authorId",verifyToken ,checkAuthor, async (req, res) => {
  //get author id
  let aid = req.params.authorId;

  //read atricles by this author which are acticve
  let articles = await ArticleModel.find({ author: aid, isArticleActive: true }).populate("author", "firstName email");
  //send res
  res.status(200).json({ message: "articles", payload: articles });
});

//edit article(protected route)
authorRoute.put("/articles",verifyToken ,checkAuthor,async (req, res) => {
  //get modified article from req
  let { articleId, title, category, content,author } = req.body;
  //find article
  let articleOfDB = await ArticleModel.findOne({_id:articleId,author:author});
  if (!articleOfDB) {
    return res.status(401).json({ message: "Article not found" });
  }
  
  //update the article
  let updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    {
      $set: { title, category, content },
    },
    { new: true },
  );
  //send res(updated article)
  res.status(200).json({ message: "article updated", payload: updatedArticle });
});

//delete(soft delete) article(Protected route)


//http://localhost:4000/user-api/users
//http://localhost:4000/author-api/users

//app.use(checkAuthor)
