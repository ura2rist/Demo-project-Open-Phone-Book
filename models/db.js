const Sequelize = require('sequelize'),
	sequelize = new Sequelize('directory','direc','9696Gory!',{
		dialect: 'mysql',
		host: '45.84.226.206'
	}),
	left = sequelize.define('left',{
		id:{
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		name:{
			type: Sequelize.STRING,
			allowNull: false
		}
	},{
		timestamps: false,
		freezeTableName: true
	}),
	main = sequelize.define('main',{
		id:{
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		name:{
			type: Sequelize.STRING,
			allowNull: false
		}
	},{
		timestamps: false,
		freezeTableName: true
	}),
	data = sequelize.define('data',{
		id:{
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		function:{
			type: Sequelize.STRING,
			allowNull: false
		},
		name:{
			type: Sequelize.STRING,
			allowNull: false
		},
		phone:{
			type: Sequelize.STRING,
			allowNull: false
		}
	},{
		timestamps: false,
		freezeTableName: true
	}),
	m_l = sequelize.define('m_l',{
		id:{
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		}
	},{
		timestamps: false,
		freezeTableName: true
	}),
	l_d = sequelize.define('l_d',{
		id:{
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		}
	},{
		timestamps: false,
		freezeTableName: true
	}),
	ld_m = sequelize.define('ld_m',{
		id:{
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		}
	},{
		timestamps: false,
		freezeTableName: true
	});

main.belongsToMany(left,{through: m_l});
left.belongsToMany(main,{through: m_l});

data.belongsToMany(left,{through: l_d});
left.belongsToMany(data,{through: l_d});

l_d.belongsToMany(main,{through: ld_m});
main.belongsToMany(l_d,{through: ld_m});

module.exports = {
	left,
	main,
	data,
	m_l,
	l_d,
	ld_m,
	sequelize,
	Sequelize
}