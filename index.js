const express =require("express");
const cheerio =require("cheerio");
const axios =require("axios");
const { response } = require("express");
const app=express();
let articles=[];
const newsPapers=[
    {
        name:"thetimes",
        address:"https://www.thetimes.co.uk/environment/climate-change",
base:''
    },
    {
        name:"theguardian",
        address:"https://www.theguardian.com/environment/climate-crisis",
base:''
    },
    {
        name:"telegraph",
        address:"https://www.telegraph.co.uk/global-warming/",
base:'https://www.telegraph.come'
    }
]
newsPapers.forEach(newsPaper=>{
axios.get(newsPaper.address).then(response=>{
const html=response.data;

const $=cheerio.load(html);
$('a:contains("climate")',html).each(function(){
    const title=$(this).text();
    const url=$(this).attr("href");
    articles.push(
        {
            title,
            url:newsPaper.base+url,
            source:newsPaper.name,

        }
    )   
})
    }).catch(err=>console.err(err))

})

app.get("/",(req,res)=>{
    res.json("this is the main")
})
    app.get("/news",(req,res)=>{
        res.json(articles);
    })
app.get("/:newsPaperId", (req,res)=>{
   let newsPaperId=req.params.newsPaperId ;
   let targetPaperAddress=newsPapers.filter(newsPaper=>newsPaper.name==newsPaperId)[0].address;
 let specifcBase=newsPapers.filter(newsPaper=>newsPaper.name==newsPaperId)[0].base;
   axios.get(targetPaperAddress).then(response=>{
    let html=response.data;
    const $=cheerio.load(html);
    const specificArticles=[];
    $('a:contains("climate")',html).each(function(){
         const title=$(this).text();
         const url=$(this).attr("href");
        specificArticles.push({
title,  
url:specifcBase+url,
source:newsPaperId,


        })
        console.log(specificArticles)
    })
    res.json(specificArticles);
   }).catch(err=>console.error(err))
  
})

app.listen( process.env.PORT||80,()=>{
    console.log("listening")
})