$(document).ready(function () {
    $('#money-amount-field').val('0.00');
    loadItems();


	$('#add-dollar-button').click(function (event) {
		var currentTotalVal = $('#money-amount-field').val();
		var newAmount = Number(currentTotalVal) + 1.00;
		$('#money-amount-field').val(newAmount.toFixed(2));
	});


	$('#add-quarter-button').click(function (event) {
		var currentTotalVal = $('#money-amount-field').val();
		var newAmount = Number(currentTotalVal) + .25;
		$('#money-amount-field').val(newAmount.toFixed(2));

	});

	$('#add-dime-button').click(function (event) {
		var currentTotalVal = $('#money-amount-field').val();
		var newAmount = Number(currentTotalVal) + .10;
		$('#money-amount-field').val(newAmount.toFixed(2));

	});

	$('#add-nickel-button').click(function (event) {
		var currentTotalVal = $('#money-amount-field').val();
		var newAmount = Number(currentTotalVal) + .05;
		$('#money-amount-field').val(newAmount.toFixed(2));

	});

	$('#change-return-button').click(function (event) {
		var total = $('#money-amount-field').val();
		var quarterCount = 0;
		var dimeCount = 0;
		var nickelCount = 0;
		var pennyCount = 0;

		if ($('change-field').val() != "undefined") {
			loadItems();
			$('#item-field').val('');
			$('#messages-field').val('');
		}

		// for the condition of returning change without making a purchase first
		if (total > 0.00) {
			var total = $('#money-amount-field').val();
			var temp = total * 100;
			var totalPennies = temp.toFixed(2);
	
			while (totalPennies >= 25){
				quarterCount++;
				totalPennies -= 25;
			}

			while (totalPennies >= 10){
				dimeCount++;
				totalPennies -= 10;
			}

			while (totalPennies >= 5){
				nickelCount++;
				totalPennies -= 5;
			}

			while (totalPennies >= 1){
				pennyCount++;
				totalPennies -= 1;
			}

			$('#money-amount-field').val('0.00');
		}

		formatChange(quarterCount, dimeCount, nickelCount, pennyCount);
		
	});


	$('#make-purchase-button').click(function (event) {
		var amount = $('#money-amount-field').val();
		var id = $('#hiddenId').val();
		
		$.ajax({
			type: 'POST',
			url: '	http://tsg-vending.herokuapp.com/money/' + amount + '/item/' + id,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			'dataType': 'json',
			success: function(data) {
				var quarters = data.quarters;
				var dimes = data.dimes;
				var nickels = data.nickels;
				var pennies = data.pennies;

				formatChange(quarters, dimes, nickels, pennies);
				$('#messages-field').val('THANK YOU!!!');
				$('#money-amount-field').val('0.00');
				loadItems();
			},
			error: function(xhr, status, error) {
				var responseText = jQuery.parseJSON(xhr.responseText);
           		$('#messages-field').val( responseText.message);
           		loadItems();

				$('#errorMessages')
					.append($('<li>')
					.attr({class: 'list-group-item list-group-item-danger'})
					.text('Error calling web service. Please try again later.'));
			}
		});
	});
});

function loadItems() {
    $('.itemDivs').empty();
    var itemDivRef = $('.itemDivs');


    $.ajax({
        type: 'GET',
        url: 'http://tsg-vending.herokuapp.com/items',
        success: function(itemArray) {
            $.each(itemArray, function(index, item) {

                var itemId = item.id;
                var itemName = item.name;
                var itemPrice = item.price.toFixed(2);
                var itemQuantity = item.quantity;

                var itemDiv = '<div class="itemDiv col-md-3" id="item' + itemId + '" onclick="idHelper(\'' + itemName + '\', '+itemId + ')"><p>';
                    itemDiv +=  itemId + '</span>';
                    itemDiv += '<br><div style="text-align: center;">'
                    itemDiv += itemName;
                    itemDiv += '<br><br>';
                    itemDiv += '$' + itemPrice;
                    itemDiv += '<br><br>';
                    itemDiv += 'Quantity Left: ' + itemQuantity;
                    itemDiv += '</div></p></div>';

                itemDivRef.append(itemDiv);
            });
        },
        error: function() {
            $('#errorMessages')
                .append($('<li>')
                    .attr({class: 'list-group-item list-group-item-danger'})
                    .text('Error calling web service. Please try again later.'));
        }
    });

}


// function to help with storing an id for making a POST
// when #make-purchase-button is clicked
function idHelper(itemName, itemId) {
	
	$('#item-field').val('(' + itemId + ') ' + itemName);
	var hiddenIdInput = '<input type ="hidden" id="' + itemId + '">';
	$('#change-field').val('');
	 $('#hiddenId').val(itemId);
}

function formatChange(quarters, dimes, nickels, pennies) {
	var changeMsg = '';
	// helps with whether to output a comma after the coin listing or not
	var coinsLeft = quarters + dimes + nickels + pennies;


	coinsLeft -= quarters;
	if (quarters == 1 & coinsLeft > 0) {
		changeMsg += quarters + ' Quarter, ';
	} else if (quarters == 1 & coinsLeft == 0) {
		changeMsg += quarters + ' Quarter ';
	} else if (quarters > 1 & coinsLeft > 0) {
		changeMsg += quarters + ' Quarters, ';
	} else if (quarters > 1 & coinsLeft == 0) {
		changeMsg += quarters + ' Quarters ';
	}

	coinsLeft -= dimes;
	if (dimes == 1 & coinsLeft > 0) {
		changeMsg += dimes + ' Dime, ';
	} else if (dimes == 1 & coinsLeft == 0) {
		changeMsg += dimes + ' Dime ';
	} else if (dimes > 1 & coinsLeft > 0) {
		changeMsg += dimes + ' Dimes, ';
	} else if (dimes > 1 & coinsLeft == 0) {
		changeMsg += dimes + ' Dimes ';
	}

	coinsLeft -= nickels;
	if (nickels == 1 & coinsLeft > 0) {
		changeMsg += nickels + ' Nickel, ';
	} else if (nickels == 1 & coinsLeft == 0) {
		changeMsg += nickels + ' Nickel ';
	} 

	if (pennies == 1) {
		changeMsg += pennies + ' Penny ';
	} else if (pennies > 1) {
		changeMsg += pennies + ' Pennies ';
	}
	
	$('#change-field').val(changeMsg);
}