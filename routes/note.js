
const crypto = require('crypto');//数据进行加密
const path = require('path');
const Comment = require('../mysql/note.js');
var formidable = require('formidable');
var fs = require('fs');
var NOTE = require('../mysql/note.js');

exports.add=(req,res)=>{
	
	var data = req.query;
	console.log(data,"***---");

	res.render('note',{
		title:'Note',
		world:"别错过年少的疯狂，时光很匆忙"
	})
	// res.end()
	// var name = req.body.username;
	// var password = req.body.password;
	
}

exports.tempNote=(req,res)=>{
	
	var data = req.body;


	if(req.body.title.length==0 || req.body.notes.length==0 ){
		res.send("写点东西,再保存吧 ！")
	}else{
		console.log("*()",req.body.title)
		req.session.tempNoteTitle =req.body.title;
		req.session.tempNotes =req.body.notes;
		res.send("保存成功")

	}
}

exports.delnoteSession=(req,res)=>{
	 req.session.tempNoteTitle="";
	  req.session.tempNotes ="";
	  res.end()
}
exports.show=(req,res)=>{
	//删除sessioNote
	 req.session.tempNoteTitle=""
	  req.session.tempNotes =""

	
	var data = req.body.content;
	// console.log(data,"***",req.session.id);
	if(req.session.username){
		// 先为每个用户建立一个独立的文件
		var dir = path.resolve(__dirname,'..')
		var fileName = req.session.userID;
		var blogName = new Date();
		var status =true;
		console.log(`${dir}/blog/${fileName}/${blogName}`)
		fs.exists(`${dir}/blog/${fileName}`,function(exists){
			if(exists){
				 fs.writeFileSync(`${dir}/blog/${fileName}/${blogName}`,data,function(err){
				 	if(err){
				 		status=false;
				 		res.send("很抱歉 发表失败 ")
				 	}
				 	//将文件名存储进数据库

				 	console.log(`${dir}/blog/${fileName}/${blogName}`,"((((")
				 

				 	//将文件名存储进数据库notes,type,userID
					 	var Data ={
							notes:blogName,
							type:req.body.type,
							userID:req.session.userID
					 	}
						NOTE.NOTE(Data,'add',callback=(results)=>{
							console.log(results)
							var REdata= {
								userID:req.session.userID,
								notId:results[0].id
							}
							res.send(REdata)
						})

				 	
				 })
				 if(status) {
				 	//将文件名存储进数据库notes,type,userID
				 	var Data ={
						notes:blogName,
						type:req.body.type,
						userID:req.session.userID
				 	}
					NOTE.NOTE(Data,'add',callback=(results)=>{
						// res.send("发表成功")
						var REdata= {
								userID:req.session.userID,
								notId:results[0].id
							}
							res.send(REdata)
					})
				 	
				 }
			}else{
				fs.mkdir(`${dir}/blog/${fileName}`,function(err){
					if(err){
						console.log("创建文件失败");
						res.send("很抱歉 发表失败 ")
					}
					fs.writeFileSync(`${dir}/blog/${fileName}/${blogName}`,data,function(err){
				 	if(err){
				 		status=false;
				 		res.send("很抱歉 发表失败 ")
				 	}
				 	//将文件名存储进数据库notes,type,userID
				 	var Data ={
						notes:blogName,
						type:req.body.type,
						userID:req.session.userID
				 	}
					NOTE.NOTE(Data,'add',callback=(results)=>{
						console.log(results)
							// res.send("发表成功")
							var REdata= {
								userID:req.session.userID,
								notId:results[0].id
							}
							res.send(REdata)
					})

		
				 	
				 })
					 if(status) {
					 	console.log("++++++++++")
					 	//将文件名存储进数据库notes,type,userID
					 	var Data ={
							notes:blogName,
							type:req.body.type,
							userID:req.session.userID
					 	}
					 	console.log(Data,"first--")
						NOTE.NOTE(Data,'add',callback=(results)=>{
							console.log(results)
							var REdata= {
								userID:req.session.userID,
								notId:results[0].id
							}
							res.send(REdata)
							// res.send("发表成功")
						})
				 		
					}
						
				})
			}
		})

	}else{
		res.send("请登录")
	}	
}


exports.look=(req,res)=>{
	
	var data = req.params;
	console.log(data,"***----");
    

	//开始异步读取文件

	

	res.render('look',{
		title:'Note',
		world:"别错过年少的疯狂，时光很匆忙"
	})

	// res.end()
	// var name = req.body.username;
	// var password = req.body.password;
	
}

