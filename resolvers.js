const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

module.exports = {
  Query: {
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) {
        return null;
      }
      const User2 = await User.findOne({
        username: currentUser.username
      }).populate({
        path: "favorites",
        model: "Post"
      });
      return User2;
    },
    getPosts: async (_, args, { Post }) => {
      const posts = await Post.find({})
        .sort({ createdDate: "desc" })
        .populate({
          path: "createdBy",
          model: "User"
        });
      return posts;
    },
    getUserPosts: async (_, { userId }, { Post }) => {
      const posts = await Post.find({
        createdBy: userId
      });
      return posts;
    },
    getPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOne({ _id: postId }).populate({
        path: 'messages.messageUser',
        model: "User"
      });
      return post;
    },
    infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
      let posts;
      if (pageNum === 1) {
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          })
          .limit(pageSize);
      } else {
        //If page number is greater than one, figure out how many posts to skip
        const skips = pageSize * (pageNum - 1);
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          })
          .skip(skips)
          .limit(pageSize);
      }
      const totalDocs = await Post.count();
      const hasMore = totalDocs > pageSize * pageNum;
      return { posts, hasMore };
    }
  },

  Mutation: {
    addPost: async (
      _,
      { title, imageUrl, categories, description, creatorId },
      { Post }
    ) => {
      const newPost = await new Post({
        title,
        imageUrl,
        categories,
        description,
        createdBy: creatorId
      }).save();
      return newPost;
    },
    likePost: async (_, { postId, username}, { Post, User }) => {
      //Find Post, add 1 to it's likes field
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: 1 } },
        { new: true }
      );
      //Find user , add id of post to favs array - to be populated as posts
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: postId } },
        { new: true }
      ).populate({
        path: 'favorites',
        model: 'Post'
      })
      //Return only likes from 'post' and faves from 'user'
      return { likes: post.likes, favorites: user.favorites };
    },
    //UNLIKE POSTS
    unlikePost: async (_, { postId, username}, { Post, User }) => {
      //Find Post, add 1 to it's likes field
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: -1 } },
        { new: true }
      );
      //Find user , remove id of post from favs array - to be populated as posts
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: postId } },
        { new: true }
      ).populate({
        path: 'favorites',
        model: 'Post'
      })
      //Return only likes from 'post' and faves from 'user'
      return { likes: post.likes, favorites: user.favorites };
    },
    deleteUserPost: async (_, { postId }, {Post }) => {
      const post = await Post.findOneAndRemove({ _id: postId });
      return post;
    },
    signinUser: async (_, { username, password }, { User }) => {
      const User1 = await User.findOne({ username });
      if (!User1) {
        throw new Error("User not found");
      }
      const isValidPassword = await bcrypt.compare(password, User1.password);
      if (!isValidPassword) {
        throw new Error("Invaid password");
      }
      return { token: createToken(User1, process.env.SECRET, "1hr") };
    },

    signupUser: async (_, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("User Already Exists");
      }
      const newUser = await new User({
        username,
        email,
        password
      }).save();
      // removed last arg '1hr' was causing issues
      return { token: createToken(newUser, process.env.SECRET) };
    }
  }
};
