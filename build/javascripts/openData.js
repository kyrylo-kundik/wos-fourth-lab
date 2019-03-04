document.addEventListener('DOMContentLoaded', function () {

	function createNode(user, index) {
		var newEl = template.cloneNode(true);
		newEl.id = 'u' + index;
		newEl.querySelector('.id').textContent = index;
		newEl.querySelector('.first').textContent = user.FirstName;
		newEl.querySelector('.last').textContent = user.LastName;
		newEl.querySelector('.user').textContent = user.UserName;
		container.append(newEl);
		newEl.style.display = 'table-row';
	}

	var template = document.getElementById('u_id');
	var container = document.getElementById('container');
	var request = new XMLHttpRequest();
	request.open('GET', 'https://services.odata.org/TripPinRESTierService/People', /* async = */ false);
	request.send();
	var response = JSON.parse(request.responseText);
	response['value'].forEach(function (item, index) {
		createNode(item, index)
	});

}, false);
