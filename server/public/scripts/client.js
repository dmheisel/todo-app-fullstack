console.log('js sourced');


$(document).ready(readyHandler);

function readyHandler() {
	$('#addButton').on('click', handleAddClick);
	$('#confirmDeleteButton').on('click', confirmDelete);
	$('#taskTable').on('click', '.deleteButton', askForConfirmation);
	$('#taskTable').on('click', '.statusButton', sendStatusUpdate);
	$('#taskTable').popover({ selector: '.detailsButton' });
	getTasks();
}

function clearInputs() {
	$('#taskName').val('');
	$('#taskDetails').val('');
}

function handleAddClick() {
	if ($('#taskName').val() !== '') {
		if ($('#deadlineSelect').val() === null) {
			$('#deadlineSelect').val('7');
		}
		let taskObj = {
			name: $('#taskName').val(),
			details: $('#taskDetails').val(),
			deadline: $('#deadlineSelect').val()
		};
		console.log(taskObj);
		addTask(taskObj);
	} else {
		alert('Task must have name field completed before submitting.');
		return;
	}
}

function askForConfirmation() {
	$('#confirmDeleteModal').modal('toggle');

	let idToDelete = $(this)
		.closest('tr')
		.data('id');
	$('#confirmDeleteModal').data('id', idToDelete);
}

function confirmDelete() {
	let idToDelete = $('#confirmDeleteModal').data('id');
	$.ajax({
		method: 'DELETE',
		url: `/tasks/${idToDelete}`
	})
		.then(response => {
			console.log('successful DELETE request to server');
			$('#confirmDeleteModal').modal('toggle');
			getTasks();
		})
		.catch(err => {
			console.log('error on DELETE request to server: ', err);
		});
}

function sendStatusUpdate() {
	//updates task's "TO DO" status to "COMPLETE" and adds class to change color, etc.
	let idToUpdate = $(this)
		.closest('tr')
		.data('id');
	let newStatus = !$(this)
		.closest('tr')
		.data('task').isDone;
	let taskToMarkDone = { isDone: newStatus };
	$.ajax({
		method: 'PUT',
		url: `/tasks/${idToUpdate}`,
		data: taskToMarkDone
	})
		.then(response => {
			console.log(`successful PUT request to server`);
			getTasks();
		})
		.catch(err => {
			console.log(`error received on PUT request to server: ${err}`);
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
					data-content="${task.details}">
						...
				</button>
				</td>`
			);
		if (task.isDone) {
			htmlText
				.append(
					`<td><button class="statusButton btn btn-success btn-sm">Done!</td>`
				)
				.addClass('bg-success text-white');
		} else {
			htmlText.append(
				`<td>
					<button
						class="statusButton btn btn-secondary btn-sm">
							To-Do
					</button>
				</td>`
			);
		}

		htmlText.append(
			`<td>
				<button
					class="deleteButton close btn"
					data-toggle="modal"
					data-target="#confirmDeleteModal">
						&times;
				</button>
			</td>`
		);
		htmlText.data('id', task.id);
		htmlText.data('task', task);
		$('#taskTable').append(htmlText);
	}
}
