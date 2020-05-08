const express = require('express'),
	router = express.Router(),
	models = require('../models'),
	passport = require('passport'),
	Op = models.db.Sequelize.Op;;

router.use(passport.initialize());
router.use(passport.session());

require('../passport');
const auth = (request,response,next)=>{
	if(request.isAuthenticated()){
		next()
	}else{
		return response.redirect('/panel/login');
	}
};

router.get('/login',(request,response)=>{
	response.render('admin/login');
});

router.get('/admin',auth,(request,response)=>{
	response.render('admin/admin');
});

router.post('/login',(request,response,next)=>{
	passport.authenticate('local', function(err, user) {
	    if (err) { 
	    	return next(err); 
	    }
	    if (!user) { 
	    	return response.send("Wrong login or password"); 
	    }
	    request.logIn(user, function(err) {
		    if (err) { 
		     	return next(err); 
		    }
		    return response.redirect('/panel/admin');
		});
	})(request, response, next);
});

router.post('/add-left',auth,(request,response)=>{
	models.db.left.create({name: request.body.mbutton});
	response.redirect('/panel/admin');
});

router.post('/add-center',auth,(request,response)=>{
	models.db.main.create({name: request.body.cbutton});
	response.redirect('/panel/admin');
});

router.post('/add-people',auth,(request,response)=>{
	models.db.data.create({name: request.body.name, function: request.body.func, phone: request.body.phone});
	response.redirect('/panel/admin');
});

router.post('/user-search',auth,(request,response)=>{
	models.db.data.findAll({where:{
		[Op.or]:[
			{
				function:{
					[Op.substring]: `${request.body.search}`
				}
			},{
				name: {
					[Op.substring]: `${request.body.search}`
				}
			},
			{
				phone: {
					[Op.substring]: `${request.body.search}`
				}
			}
		]
	}})
		.then(result=>{
			response.json({
				result:result
			});
		})
		.catch(err=>console.log(err));
});

router.post('/all-assign',auth,(request,response)=>{
	models.db.left.findAll({
		include:{
			model: models.db.main
		}
	})
		.then(left=>{
			models.db.main.findAll({})
				.then(main=>{
					response.json({
						result: left,
						main: main
					});
				})
				.catch(err=>console.log(err));
		})
		.catch(err=>console.log(err));
});

router.post('/del-link',auth,(request,response)=>{
	models.db.m_l.destroy({
		where: {id: request.body.linkId}
	})
		.then(res=>{
			response.json({
				remove:true
			})
		})
		.catch(err=>console.log(err));
});

router.post('/create-link',auth,(request,response)=>{
	models.db.left.findOne({
		where:{id: request.body.left}
	})
		.then(left=>{
			models.db.main.findOne({
				where: {id: request.body.main}
			})
				.then(main=>{
					left.addMain(main);
					response.json({
						add: true
					});
				})
				.catch(err=>console.log(err));
		})
		.catch(err=>console.log(err));
});

router.post('/user-edit',auth,(request,response)=>{
	models.db.data.update({function: request.body.func, name: request.body.name, phone: request.body.phone},{
		where: {
			id: request.body.id
		}
	})
		.then(data=>{
			response.json({
				edit: true
			});
		})
		.catch(err=>console.log(err));
});

router.post('/user-assign',auth,(request,response)=>{
	models.db.left.findAll({
		include:{
			model: models.db.data
		}
	})
		.then(left=>{
			models.db.main.findAll({
				include:{
					model: models.db.left
				}
			})
				.then(main=>{
					models.db.data.findOne({
						where:{
							id: request.body.id
						}
					})
						.then(data=>{
							data.getLefts()
								.then(lef => {
								    return Promise.all(
								        lef.map(left => models.db.l_d.findOne({where: {id: left.l_d.id}})
								            .then(ld => ld.getMains())
								        )
								    ).then(mains => mains.flatMap((main, i) => main.map(m => ({
								        data: data.name,
								        dataId: data.id,
								        left: lef[i].name,
								        leftId: lef[i].id,
								        main: m.name,
								        mainId: m.id,
								        linkId: m.ld_m.id
								    }))));
								})
								.then(
								    result =>{
										response.json({
											left: left,
											main: main,
											result: result
										});
									},
								    err => console.log(err)
								)
								.catch(err=>console.log(err));
						})
						.catch(err=>console.log(err));
				})
				.catch(err=>console.log(err))
		})
		.catch(err=>console.log(err));	
});

router.post('/del-link-data',auth,(request,response)=>{
	models.db.l_d.destroy({
		where: {id: request.body.linkId}
	})
		.then(res=>{
			response.json({
				remove:true
			})
		})
		.catch(err=>console.log(err));
});

router.post('/del-data',auth,(request,response)=>{
	models.db.data.destroy({
		where: {id: request.body.linkId}
	})
		.then(res=>{
			response.json({
				remove:true
			})
		})
		.catch(err=>console.log(err));
});


router.post('/create-link-data',auth,(request,response)=>{
	models.db.left.findOne({
		where:{id: request.body.left}
	})
		.then(left=>{
			models.db.data.findOne({
				where: {id: request.body.data}
			})
				.then(data=>{
					left.addData(data);
					response.json({
						link: true
					});
				})
				.catch(err=>console.log(err));
		})
		.catch(err=>console.log(err));
});

router.post('/create-link-ldm',auth,(request,response)=>{
	models.db.main.findOne({
		where:{id: request.body.main}
	})
		.then(main=>{
			models.db.l_d.findOne({
				where: {id: request.body.ld}
			})
				.then(ld=>{
					ld.addMain(main);
					response.json({
						add: true
					});
				})
				.catch(err=>console.log(err));
		})
		.catch(err=>console.log(err));
});

router.post('/rem-data-link-second',auth,(request,response)=>{
	models.db.ld_m.destroy({
		where: {id: request.body.linkId}
	})
		.then(res=>{
			response.json({
				remove:true
			})
		})
		.catch(err=>console.log(err));
});

router.post('/view-all',auth,(request,response)=>{
	models.db.left.findAll({raw: true})
		.then(left=>{
			models.db.main.findAll({raw: true})
				.then(main=>{
					response.json({
						left: left,
						main: main
					})
				})
				.catch(err=>console.log(err));
		})
		.catch(err=>console.log(err));
});

router.post('/edit-main',auth,(request,response)=>{
	models.db.left.update({name: request.body.edit},{
		where: {
			id: request.body.where
		}
	})
		.then(data=>{
			response.json({
				status: true
			});
		})
		.catch(err=>console.log(err));
});

router.post('/edit-sec', auth,(request,response)=>{
	models.db.main.update({name: request.body.edit},{
		where: {
			id: request.body.where
		}
	})
		.then(data=>{
			response.json({
				status: true
			});
		})
		.catch(err=>console.log(err));
});

module.exports = router;