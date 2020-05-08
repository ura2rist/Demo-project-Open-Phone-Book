const express = require('express'),
	app = express(),
	{PORT} = require('./config'),
	bodyParser = require('body-parser'),
	path = require('path'),
	routes = require('./routes'),
	session = require('express-session'),
	FileStore = require('session-file-store')(session),
	passport = require('passport');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(
	session({
		secret: 'qwerw',
		store: new FileStore(),
		cookie:{
			path: '/',
			httpOnli: true,
			maxAge: 60*60*5000
		},
		resave: false,
		saveUninitialized: false
	})
);

app.use('/', routes.directory);
app.use('/panel', routes.admin);
app.use('/search', routes.search);

app.listen(PORT,(error)=>{
	if(!error){
		console.log(`Сервер запущен, порт ${PORT}`);
	}else{
		console.log(`Ошибка запуска error`);
	}
});