var cart = {
	'add': function(product_id, quantity) {
		$.ajax({
			url: 'index.php?route=checkout/cart/add',
			type: 'post',
			data: 'product_id=' + product_id + '&quantity=' + (quantity ? quantity : 1),
			dataType: 'json',		
			success: function(json) {
				if (json['success']) {
					$(".shopping-bag").fadeIn("fast");
				}
				else
					alert("undefined error!");
			}
		});
	},
	'update': function(key, div) {
		var quantity = $(div).val();
		if (quantity < 1) {
			$(div).val(1);
			quantity = 1;
		}
		
		$.ajax({
			url: 'index.php?route=checkout/cart/edit',
			type: 'post',
			data: 'key=' + key + '&quantity=' + quantity,
			dataType: 'json',	
			success: function(json) {
				$(".cart .total").fadeOut("fast", function(e) {
					$(this).html(json['total']).fadeIn("fast");
				});
				$(div).parent().parent().find(".cart-total").fadeOut("fast", function(e) {
					$(this).html(json['total_cur']).fadeIn("fast");
				});
			}
		});
	},
	'remove': function(key, div) {
		$.ajax({
			url: 'index.php?route=checkout/cart/remove',
			type: 'post',
			data: 'key=' + key,
			dataType: 'json',		
			success: function(json) {
				if ($(".cart-body .product").length > 1) {
					$(div).parent().parent().remove();
					
					$(".cart .total").fadeOut("fast", function(e) {
						$(this).html(json['total']).fadeIn("fast");
					});
				}
				else
					location.reload();
			}
		});
	}
}

function saveProffile(id) {
	var obj = $(id+' input, '+id+' select, '+id+' textarea');
	obj.removeClass("hasError");

    $.ajax({
        url: 'index.php?route=checkout/guest_shipping/save',
        type: 'post',
        data: obj,
        dataType: 'json',
        success: function(json) {
            if (json['error']) {
				$.each(json['error'], function(key, value) {
					$(id+" *[name='"+key+"']").addClass("hasError");
				});
            }
			else {
				showNextTab();
				
				confirmOrder();
			}
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function showNextTab() {
	var tabs = $(".nav-tabs");
	tabs.find(".active").next("li").find("a").attr("data-toggle", "tab").tab('show');
}
function confirmOrder() {
	$.ajax({
		type: 'get',
		url: 'index.php?route=payment/cod/confirm',
		cache: false,
        success: function() {
			/*setTimeout(function() { 
				goTo(mainPage);
			}, 5000);*/
			$(".nav-tabs > li > a[data-toggle='tab']:not(a[href='#checkout'])").removeAttr("data-toggle");
		},
		error: function(xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
	});
}

$(document).ready(function(e) {
    $(".number").keydown(function(e) {
        if ((48 > e.keyCode || e.keyCode > 58) && e.keyCode != 8 && e.keyCode != 116 && e.keyCode != 37 && e.keyCode != 39) {
			e.preventDefault();
		}
    });
	$(".nav-tabs a:not([data-toggle])").click(function(e) {
        e.preventDefault();
    });
});