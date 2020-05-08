const passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	admin = {
		id: 1,
		login: 'admin',
		password: 'wwqe1rws'
	};

passport.serializeUser(function(user,done){
	done(null,user.id);
});

passport.deserializeUser(function(id,done){
	const user = (admin.id === id) ? admin : false;
	done(null,user.id);
});

passport.use(
	new LocalStrategy({usernameField: 'login'},function(login, password, done) {
		if(login === admin.login && password === admin.password){
			return done(null,admin);
		}else{
			return done(null,false);
		}
	})
);