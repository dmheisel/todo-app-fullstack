console.log('js sourced');

$(document).ready(readyHandler);

function readyHandler() {
	getTasks();
}

function getTasks() {
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
}

function renderTasks(taskList) {
	for (let task of taskList) {
		let taskRow = $(`<li>${task.name}<br>${task.details}</li>`);
		taskRow.data('task', task);
		$('#taskList').append(taskRow);
	}
}
