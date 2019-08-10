console.log('js sourced');

$(document).ready(readyHandler);

function readyHandler() {
	$('#addButton').on('click', onAddClick )
	getTasks();
}

const 


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
	for (let task of list) {
		let deadline = new Date(task.deadline).toDateString();
		let htmlText = $(`<tr></tr>`);
		htmlText
			.append(`<th scope="row"></th>`)
			.append(`<td>${task.name}</td`)
			.append(`<td>${task.details}</td>`)
			.append(`<td>${deadline}</td>`)
			.append(
				`<td><button class="btn btn-primary rounded-pill">Done?</button></td>`
			);
		htmlText.data('id', task.id);
		htmlText.data('task', task);
		$('#taskTable').append(htmlText);
	}
}
