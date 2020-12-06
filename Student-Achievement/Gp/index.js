const express=require("express");
const app=express();
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const session=require('express-session');
//const bodyParser=require("body-parser");
//let user_id;

app.use(express.static("assets"));

app.use(express.urlencoded({extended:true}));
app.use(session({ secret:'notagoodsecret' }));

const User=require('./models/user');

app.set("view engine","ejs"); 

app.listen(3000, () => { 
    console.log('Server listening on port 3000'); 
});

mongoose.connect('mongodb://localhost:27017/userAuth', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// const requireLogin = (req, res, next) => {
//     if (!req.session.user_id) {
//         return res.redirect('/login')
//     }
//     next();
// }
app.get("/",(req,res)=>{
    res.render("index");
});

// app.get('/secret', (req,res)=>{
//     if(!req.session.user_id){
//         res.redirect('/login');
//     }
//     res.send("THIS IS A SECRET AND CAN BE SEEN IF U ARE LOGGED IN ONLY!");
// }); 

//INDEX ROUTE
app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register", async (req,res)=>{
    const { username,pwd }=req.body;
    const hash= await bcrypt.hash(pwd,12);
    //res.send(hash);
    const user=new User({
        username:username,
        password:hash
    });
    await user.save();
    //req.session.user_id=user_id;
    res.redirect("/");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.post("/login", async (req,res)=>{
    const { username,pwd }=req.body;
    const user= await User.findOne({ username });
    const validPassword = await bcrypt.compare(pwd,user.password);
    if(validPassword){
        //req.session.user_id=user_id;
        res.redirect('/home');
    }
    else{
         res.send('Try again');
    }
});

app.post('/logout', (req, res) => {
    //req.session.user_id = null;
    // req.session.destroy();
    res.redirect('/login');
})

app.get('/home',(req, res) => {
    res.render('home')
})
// app.get('/topsecret', requireLogin, (req, res) => {
//     res.send("TOP SECRET!!!")
// })

