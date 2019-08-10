console.log('js sourced');

$(document).ready(readyHandler);

function readyHandler() {
	getTasks();
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
}

function renderTasks(list) {
	
}
