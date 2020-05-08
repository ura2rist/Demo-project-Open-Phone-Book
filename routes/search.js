const express = require('express'),
	router = express.Router(),
	models = require('../models'),
	Op = models.db.Sequelize.Op;

router.post('/all',(request,response)=>{
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
				table: result
			})
		})
		.catch(err=>console.log(err));
});

router.post('/in',(request,response)=>{
	models.db.left.findAll({
		where:{
			id:request.body.left
		},
		include:{
			model: models.db.data,
			where:{
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
			]}
		}
	})
		.then(result=>{
			if(result[0]){
				response.json({
					table: result[0].data,
					status: true
				})
			}else{
				response.json({
					status: false
				})
			}
		})
		.catch(err=>console.log(err));
});

module.exports = router;