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