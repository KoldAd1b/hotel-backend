const { StatusCodes } = require("http-status-codes");
const Post = require("../models/BlogPost");
const CustomError = require("../errors")



const addPost = async (req,res,next)=>{
    const {body,author,title} = req.body;
    const image = req.body.image;
    const subhHeading = req.body.subhHeading;

    const blog = new Post({
        body,author,title,image,subhHeading
    })

    await blog.save();
     
    res.status(StatusCodes.CREATED).json({
        blog,
        status:"Sucess"
    })
}

const editPost = async (req,res,next)=>{
    const blogId = req.params.id;

    const post = await Post.findById(blogId);

    if(!post){
        throw new CustomError.NotFoundError("The blog with the following id was not found")
    }

    const {body,author,title} = req.body;
    const image = req.body.image;
    const subhHeading = req.body.subhHeading;



    

    const updatedBlog = await User.findByIdAndUpdate(id,req.body, {
        new: true,
        runValidators: true,
      });

    res
    .status(StatusCodes.CREATED)
    .json({ status: "success", message: "Succesfully updated the blog" });





}

const deletePost= async (req,res,next)=>{
    const blogId= req.params.id;


    const blog = await Post.findById(blogId);

    if(!blog){
        throw new CustomError.NotFoundError("The blog with the following id was not found")
    }

    await Post.findByIdAndDelete(blogId);

    res.status(StatusCodes.OK).json({
        message:"Succesfully deleted the blog",
        status:"Success"
    })

}

const getPost =async (req,res,next)=>{
    const blogId = req.params.id;

    const blog = await Post.findById(blogId);

    if(!blog){
        throw new CustomError.NotFoundError('The blog with the followind id was not found')    
    }

    res.status(StatusCodes.OK).json({
        blog
    })


}




const addComment= async (req,res,next)=>{
    
    const blogId = req.params.id;

    const {author,text} = req.body;

    const photoUrl= req.body.photoUrl;

    const post = await Post.findById(blogId);

    if(!post){
        throw new CustomError.NotFoundError("The blog with the following id was not found")
    }


    const updatedPost = await Post.findByIdAndUpdate(post._id,{
        text,author,photoUrl
    },{new:true,runValidators:true});


    
    res.status(StatusCodes.OK).json({
        status:"Success",
        message:"Succesfully added the comment"
    })    


}

const editComment = async (req,res,next)=>{
    const blogId = req.params.id;
    const commentId = req.params.commentId;

    const {author,text} = req.body;

    const photoUrl= req.body.photoUrl;

    const post = await Post.findById(blogId);

    if(!post){
        throw new CustomError.NotFoundError("The blog with the following id was not found")
    }


    const updatedPost = await Post.findOneAndUpdate({"_id":blogId,"comments._id":commentId},{
        "$set":{
            "comments.$":{author,text,photoUrl}
        }
    })

    
    res.status(StatusCodes.OK).json({
        status:"Success",
        message:"Succesfully updated the comment"
    })    


}

const deleteComment = async (req,res,next)=>{
    const blogId = req.params.id;
    const commentId = req.params.commentId;


    const {author,text} = req.body;

    const photoUrl= req.body.photoUrl;

    const post = await Post.findById(blogId);

    if(!post){
        throw new CustomError.NotFoundError("The blog with the following id was not found")
    }


    await Post.findByIdAndUpdate(blogId,{
        $pull:{
            comments:{
                "_id":commentId
            }
        }
    })

    res.status(StatusCodes.OK).json({
        status:"Success",
        message:"Successfully deleted the comment"
    })


    
    res.status(StatusCodes.OK).json({
        status:"Success",
        message:"Succesfully deleted the comment "
    })    

}

const likePost = (req,res,next)=>{
    const userId = req.user.id;
    const postId= req.params.id;
   


    const post = await Post.findById(postId);

    if(!post){
        throw new CustomError.NotFoundError("The post with the following id was not found");
    }

    const userHasLiked = post.likes.findIndex(like=>like.id.toString() === userId) !== -1;

    if(userHasLiked){
        await Post.findByIdAndUpdate(post._id,{
            $push:{
                likes:userId,
            }
        })
    }else{
        await Post.findByIdAndUpdate(post._id,{
            $pull:{
                likes:userId,
            }
        })
    }

    
}

module.exports = {
    editComment,addComment,likePost,deleteComment,addPost,getPost,deletePost,editPost
}