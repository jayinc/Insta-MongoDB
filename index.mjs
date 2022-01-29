import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

// call middleware
app.use(express.json());

let port = process.env.PORT || 3000;
let URI = `mongodb+srv://atlas-monster:greek-Myth@cluster0.owvlg.mongodb.net/postDB?retryWrites=true&w=majority`;

mongoose
  .connect(URI)
  .then(() => {
    console.log("You're DB is conected");
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
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

let User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("I am your Server");
});

//        URI : Params
app.post("/post", (req, res) => {
  const { title, description } = req.body;
  console.log(title,description);
    
  if(title !='' || description != ''){
    let newUserPost = new User(
      {
        title,
        description,
      }
    )
    newUserPost.save((err,save)=>{
      if(!err){
       return res.status(200).send("Post Successfully");
      }
      else{
       return  res.status(400).send("Some Thing went Wrong")
      }
    })
  }
 
 
  
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
