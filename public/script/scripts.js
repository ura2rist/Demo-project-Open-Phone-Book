$(document).ready(function(){
	$('.mleft').on('click',function(){
		$('.mleft').removeClass('action');
		$(this).addClass('action');
		let left = $(this).data('left');
		$.ajax({
			type: 'POST',
			url: '/view-main',
			data: {
				left: left
			},
			success:function(items){
				$('.table-main').hide('slow');
				$('.button-main').hide('slow',function(){
					$('.main-menu > nav > ul').empty();
					items.main.forEach(function(body){
						$('.main-menu > nav > ul').append('<li class="mmain" data-main="' + body.id + '">' + body.name + '</li>');
					});
				});
				$('.button-main').slideToggle('slow');
			},
			error:function(err){
				console.log(err);
			}
		});
	});

	$(document).on('click','.mmain',function(){
		$('.mmain').removeClass('action-m');
		$(this).addClass('action-m');
		let main = $(this).data('main');
		let left = $('.action').data('left');
		$.ajax({
			type: 'POST',
			url: '/view-content',
			data: {
				left:left,
				main:main
			},
			success: function(items){
				getTable(items);
				$('.table-main').slideToggle('slow');
			},
			error: function(err){
				console.log(err);
			}
		});
	});

	$('.button-search span').on('click',function(){
		if($('input[name=srch]:checked').val() == 'all'){
			$.ajax({
				type: 'POST',
				url: '/search/all',
				data:{
					search: $('.search-inp').val()
				},
				success: function(items){
					$('.button-main').hide('slow');
					getTable(items);
					$('.table-main').slideToggle('slow');
				},
				error: function(err){
					console.log(err);
				}
			});
		}else if($('input[name=srch]:checked').val() == 'in'){
			if($('.action').length >= 1){
				$.ajax({
					type: 'POST',
					url: '/search/in',
					data:{
						search: $('.search-inp').val(),
						left: $('.action').data('left')
					},
					success: function(items){
						$('.button-main').hide('slow');
						if(items.status){
							getTable(items);
						}
						$('.table-main').slideToggle('slow');
					},
					error: function(err){
						console.log(err);
					}
				});
			}else{
				alert('No selected primary group');
			}
		}
	});

	function getTable(items){
		$('.table-main').hide('slow',function(){
			$('.table-content > table > tbody').empty();
			items.table.forEach(function(body){
				$('.table-content > table > tbody').append('<tr><td>' + body.function + '</td><td>' + body.name + '</td><td>' + body.phone + '</td></tr>');
			});
		});
	}
});
$(document).ready(function(){
	$('#add').on('click',function(){
		$('.edit').hide('slow');
		$('.add').slideToggle('slow');
	});
	$('#edit').on('click',function(){
		$('.add').hide('slow');
		$('.edit').slideToggle('slow');
	});
});

$(document).on('click','#search-butt-user',function(e){
	e.preventDefault();
	$.ajax({
		type: 'POST',
		url: '/panel/user-search',
		data: {
			search: $('#search-user').val()
		},
		success:function(items){
			$('.table-user tbody').empty();
			items.result.forEach(function(item){
				$('.table-user tbody').append('<tr><th scope="row" class="user-id">' + item.id + '</th><td class="user-funct">' + item.function + '</td><td class="user-name">' + item.name + '</td><td class="user-phone">' + item.phone + '</td><td class="button-edit"><button type="button" class="btn btn-primary edit-user" data-toggle="modal" data-target="#edit-user">edit</button><button type="button" class="btn btn-primary assign-but" data-toggle="modal" data-target="#li-data">assign</button></td></tr>');
			});
		},
		error: function(error){
			console.log(error);
		}
	})
});

$(document).on('click', '#assing-all',function(e){
	e.preventDefault();
	$.ajax({
		type: 'POST',
		url: '/panel/all-assign',
		success:function(items){
			$('.main-assign-all').empty();
			$('.link-button').empty();
			$('.left-assign-all').empty();

			items.main.forEach(function(item){
				$('.main-assign-all').append('<option value="' + item.id + '">' + item.name + '</option>');
			});		

			items.result.forEach(function(item){
				$('.left-assign-all').append('<option value="' + item.id + '">' + item.name + '</option>');
				if(item.mains.length > 0){
					item.mains.forEach(function(it){
						$('.link-button').append('<option value="' + it.m_l.id + '">' + item.name + '+' + it.name + '</option>');
					});
				};
			});

		},
		error: function(error){
			console.log(error);
		}
	})
});

$(document).on('click','#rem-but-link',function(e){
	e.preventDefault();
	$.ajax({
		type: 'POST',
		url: '/panel/del-link',
		data:{
			linkId: $('.link-button').val()
		},
		success: function(item){
			if(item.remove){
				document.location.href = '/panel/admin';
			}
		},
		error: function(error){
			console.log(error);
		} 
	});
});

$(document).on('click','#create-link',function(e){
	e.preventDefault();
	$.ajax({
		type: 'POST',
		url: '/panel/create-link',
		data: {
			left: $('.left-assign-all').val(),
			main: $('.main-assign-all').val()
		},
		success: function(item){
			if(item.add){
				document.location.href = '/panel/admin';
			}
		},
		error: function(error){
			console.log(error);
		}
	});
});


$(document).on('click','.edit-user', function(e){
	e.preventDefault();
	let user = {
		id: $(this).closest('tr').find('.user-id').text(),
		name: $(this).closest('tr').find('.user-name').text(),
		function: $(this).closest('tr').find('.user-funct').text(),
		phone: $(this).closest('tr').find('.user-phone').text()
	};
	$('#edit-id').text(user.id);
	$('#edit-function').val(user.function);
	$('#edit-name').val(user.name);
	$('#edit-phone').val(user.phone);
});

$(document).on('click', '#user-save', function(e){
	e.preventDefault();
	$.ajax({
		type: 'POST',
		url: '/panel/user-edit',
		data: {
			id: $('#edit-id').text(),
			func: $('#edit-function').val(),
			name: $('#edit-name').val(),
			phone: $('#edit-phone').val()
		},
		success: function(item){
			if(item.edit){
				document.location.href = '/panel/admin';
			}
		},
		error: function(error){
			console.log(error);
		}
	})
});

$(document).on('click','.assign-but',function(e){
	$('.link-data').empty();
	$('.left-for-link').empty();
	$('.md-second').empty();
	$('.md-main').empty();
	$('.link-data-second').empty();
	let user = $(this).closest('tr').find('.user-id').text();
	$('#data-link-id').text(user);
	$.ajax({
		type: 'POST',
		url: '/panel/user-assign',
		data: {
			id: user
		},
		success: function(item){
			let lefts = [];
			item.left.forEach(function(ite){
				$('.left-for-link').append('<option value="' + ite.id + '">' + ite.name + '</option>');
				ite.data.forEach(function(it){
				if(user == it.id){
					lefts.push(it.l_d.leftId);
					$('.link-data').append('<option value="' + it.l_d.id + '">' + ite.name + '+' + it.name + '</option>');
					$('.md-main').append('<option value="' + it.l_d.id + '">' + ite.name + '+' + it.name + '</option>');
				}
				});
			});
			item.main.forEach(function(ite){
				let amount = 0;
				ite.lefts.forEach(function(it){
					if(lefts.indexOf(it.id) >= 0 && amount == 0){
						amount++;
						$('.md-second').append('<option value="' + ite.id + '">' + ite.name + '</option>');
					}
				});
			});
			item.result.forEach(function(ite){
				$('.link-data-second').append('<option value="' + ite.linkId + '">' + ite.data + ' - ' + ite.left + ' - ' + ite.main +'</option>');
			})
		},
		error: function(error){
			console.log(error);
		}
	});
});

$(document).on('click','#rem-data-link',function(e){
	e.preventDefault();
	$.ajax({
		type: 'POST',
		url: '/panel/del-link-data',
		data:{
			linkId: $('.link-data').val()
		},
		success: function(item){
			if(item.remove){
				document.location.href = '/panel/admin';
			}
		},
		error: function(error){
			console.log(error);
		} 
	});
});

$(document).on('click','#rem-contact',function(e){
	e.preventDefault();
	$.ajax({
		type: 'POST',
		url: '/panel/del-data',
		data:{
			linkId: $('#edit-id').text()
		},
		success: function(item){
			if(item.remove){
				document.location.href = '/panel/admin';
			}
		},
		error: function(error){
			console.log(error);
		} 
	});
});

$(document).on('click', '#link-data-main', function(e){
	e.preventDefault();
	$.ajax({
		type: 'POST',
		url: '/panel/create-link-data',
		data:{
			left: $('.left-for-link').val(),
			data: $('#data-link-id').text()
		},
		success: function(item){
			if(item.link){
				document.location.href = '/panel/admin';
			}
		},
		error: function(error){
			console.log(error);
		}
	});
});

$(document).on('click','#link-dm-second',function(e){
	e.preventDefault();
	$.ajax({
		type: 'POST',
		url: '/panel/create-link-ldm',
		data: {
			ld: $('.md-main').val(),
			main: $('.md-second').val()
		},
		success: function(item){
			if(item.add){
				document.location.href = '/panel/admin';
			}
		},
		error: function(error){
			console.log(error);
		}
	});
});

$(document).on('click','#link-data-second',function(e){
	e.preventDefault();
	$.ajax({
		type: 'POST',
		url: '/panel/rem-data-link-second',
		data:{
			linkId: $('.link-data-second').val()
		},
		success: function(item){
			if(item.remove){
				document.location.href = '/panel/admin';
			}
		},
		error: function(error){
			console.log(error);
		} 
	});
});

$(document).on('click','#edit-button',function(e){
	$('.edit-main-button').empty();
	$('.edit-second-button').empty();
	$.ajax({
		type: 'POST',
		url: '/panel/view-all',
		success: function(item){
			item.left.forEach(function(left){
				$('.edit-main-button').append('<option value="' + left.id + '">' + left.name + '</option>');
			});
			item.main.forEach(function(main){
				$('.edit-second-button').append('<option value="' + main.id + '">' + main.name + '</option>');
			});
		},
		error: function(error){
			console.log(error);
		}
	});
});

$(document).on('click', '#edit-group-main',function(e){
	e.preventDefault();
	$.ajax({
		type: 'POST',
		url: '/panel/edit-main',
		data: {
			where: $('.edit-main-button').val(),
			edit: $('#edit-main-group').val()
		},
		success: function(item){
			if(item.status){
				document.location.href = '/panel/admin';
			}
		},
		error: function(error){
			console.log(error);
		}
	});
});

$(document).on('click', '#edit-group-sec',function(e){
	e.preventDefault();
	$.ajax({
		type: 'POST',
		url: '/panel/edit-sec',
		data: {
			where: $('.edit-second-button').val(),
			edit: $('#edit-sec-group').val()
		},
		success: function(item){
			if(item.status){
				document.location.href = '/panel/admin';
			}
		},
		error: function(error){
			console.log(error);
		}
	});
});