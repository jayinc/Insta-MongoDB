import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

// call middleware
app.use(express.json());
app.use(cors());

let port = process.env.PORT || 3000;
let URI = `mongodb+srv://atlas-monster:greek-Myth@cluster0.owvlg.mongodb.net/postDB?retryWrites=true&w=majority`;

mongoose
  .connect(URI)
  .then(() => {
    console.log("You're connected to MongoDB.");
  })
  .catch((e) => {
    console.log("Error connecting to DB" + e);
  });

let userSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

let User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("I am your ExpressJS app");
});

//  Create a Post
app.post("/post", (req, res) => {
  const { title, description } = req.body;
  console.log(title, description);

  // let UserCount = db.collection.count();
  // UserCount.count(newUserPost).then((count) => {
  //   console.log(count);
  // });

  if (title != "") {
    let newUserPost = new User({
      title,
      description,
    });

    newUserPost.save((err, save) => {
      if (!err) {
        return res.status(200).send(
          `Posted Successfully! 😎🪄`
          // \n You now have ${UserCount} posts now.
        );
      } else {
        return res.status(400).send("Oops! Something's wrong 😭");
      }
    });
  } else {
    return res.json({
      message: "Atleast give a title..😑",
    });
  }
});

// Get ALL Posts
app.get("/posts", (req, res) => {
  User.find({}, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      res.status(500).send("Something went wrong 😓");
    }
  });
});

// Delete Post
app.delete("/post/:id", (req, res) => {
  User.deleteOne({ _id: req.params.id }, {}, (err) => {
    if (!err) {
      return res.send("Post Deleted Successfully 🙌");
    } else {
      return res.send("Couldn't delete post. Something went Wrong 😥");
    }
  });
});


// Delete All Post
app.delete("/delete", (req, res) => {
  User.deleteMany((err) => {
    if (!err) {
      return res.send("All Post Deleted Successfully 🙌");
    } else {
      return res.send("Couldn't delete All post. Something went Wrong 😥");
    }
  });
});


// Update Post
app.put("/post/:id", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    { title: req.body.title, description: req.body.description },
    (err) => {
      if (!err) {
        return res.send("Post Updated 😇");
      } else {
        return res.send("Something's wrong 😮");
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
