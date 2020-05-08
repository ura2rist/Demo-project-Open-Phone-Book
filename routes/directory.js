const express = require('express'),
	router = express.Router(),
	models = require('../models');

router.get('/',(request,response)=>{
	models.db.left.findAll({raw: true})
		.then(left=>{
			response.render('index',{
				left: left
			});
		})
		.catch(err=>console.log(err));
});

router.post('/view-main',(request,response)=>{
	models.db.left.findOne({where: {id: request.body.left}})
		.then(left=>{
			left.getMains()
				.then(main=>{
					response.json({
						main:main
					});
				})
				.catch(err=>console.log(err));
		})
		.catch(err=>console.log(err));
});

router.post('/view-content',(request,response)=>{
	models.db.sequelize.query("select DISTINCT d.* from data as d JOIN l_d ON d.id = l_d.datumId JOIN `left` ON `left`.id = l_d.leftId JOIN ld_m ON ld_m.lDId = l_d.id JOIN main ON main.id = ld_m.mainId JOIN m_l ON m_l.mainId = main.id WHERE ld_m.mainId = " + request.body.main +" and l_d.leftId = " + request.body.left + " AND m_l.leftId =" + request.body.left)
		.then(all=>{
			response.json({
				table: all[0]
			})
		})
		.catch(err=>console.log(err));
});

module.exports = router;