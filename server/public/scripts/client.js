console.log('js sourced');

$(document).ready(readyHandler);

function readyHandler() {
	$('#addButton').on('click', onAddClick);
	$('#taskTable').on('click', '.deleteButton', onDeleteClick);
	$('#taskTable').popover({ selector: '.detailsButton' });
	getTasks();
}

function clearInputs() {
	$('#taskName').val('');
	$('#taskDetails').val('');
}

function onAddClick() {
	if ($('#taskName').val() !== '') {
		let taskObj = {
			name: $('#taskName').val(),
			details: $('#taskDetails').val()
		};
		addTask(taskObj);
	} else {
		alert('Task must have name field completed before submitting.');
		return;
	}
}

function onDeleteClick() {
	let idToDelete = $(this)
		.closest('tr')
		.data('id');
	$.ajax({
		method: 'DELETE',
		url: `/tasks/${idToDelete}`
	})
		.then(response => {
			console.log('successful DELETE request to server');
			getTasks();
		})
		.catch(err => {
			console.log('error on DELETE request to server: ', err);
		});
}

function addTask(task) {
	$.ajax({
		method: 'POST',
		url: '/tasks',
		data: task
	})
		.then(response => {
			console.log('successful POST route to server: ', response);
			clearInputs();
			$('#inputFields').collapse('hide');
			getTasks();
		})
		.catch(err => {
			console.log('error on POST route to server: ', err);
		});
}

const getTasks = () => {
	console.log('running getTasks function');

	$.ajax({
		method: 'GET',
		url: '/tasks'
	})
		.then(response => {
			console.log('successful GET route to server');
			let taskList = response;
			renderTasks(taskList);
		})
		.catch(err => {
			console.log('error on GET route from server: ', err);
		});
};

function renderTasks(list) {
	$('#taskTable').empty();
	for (let task of list) {
		let deadline = new Date(task.deadline).toDateString();

		let htmlText = $(`<tr></tr>`);
		
		htmlText
			.append(`<th scope="row"></th>`)
			.append(`<td>${task.name}</td`)
			.append(`<td>${deadline}</td>`)
			.append(
				`<td>
				<button
					class="btn btn-outline-info detailsButton"
					data-toggle="popover"
					title="Task Details"
					data-content="${task.details}"
					>...
				</button>
				</td>`
			)
			.append(
				`<td><button class="btn btn-secondary btn-sm">To-Do</button></td>`
			)
			.append(
				`<td><button class="deleteButton close btn">&times;</button></td>`
			);
		htmlText.data('id', task.id);
		htmlText.data('task', task);
		$('#taskTable').append(htmlText);
	}
}
