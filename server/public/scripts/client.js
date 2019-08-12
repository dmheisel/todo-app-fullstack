console.log('js sourced');

$(document).ready(readyHandler);

function readyHandler() {
	$('#addButton').on('click', handleAddClick);
	$('#confirmDeleteButton').on('click', confirmDelete);
	$('#taskTable').on('click', '.deleteButton', askForConfirmation);
	$('#taskTable').on('click', '.statusButton', sendStatusUpdate);
	$('#taskTable').popover({ selector: '.detailsButton' });

	$('#taskTable').on('mouseenter', '.statusDone', toggleMouseEnter);
	$('#taskTable').on('mouseleave', '.statusDone', toggleMouseLeave);
	$('#taskTable').on('mouseenter', '.statusToDo', toggleMouseEnter);
	$('#taskTable').on('mouseleave', '.statusToDo', toggleMouseLeave);

	getTasks();
}

//functions to dynamically add mouseenter and mouseleave to status button
//generally better to use this than try to dynamically add hover?
function toggleMouseEnter() {
	if ($(this).text() === 'Done!') {
		$(this).text('Undo?');
	} else if ($(this).text() === 'To-Do') {
		$(this).text('Done?');
	}
}
function toggleMouseLeave() {
	if ($(this).text() === 'Undo?') {
		$(this).text('Done!');
	} else if ($(this).text() === 'Done?') {
		$(this).text('To-Do');
	}
}

//function to clear inputs
function clearInputs() {
	$('#taskName').val('');
	$('#taskDetails').val('');
}

//function to gather field inputs and create object to send to database
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

//toggles modal to ask for confirmation of task deletion
function askForConfirmation() {
	$('#confirmDeleteModal').modal('toggle');

	let idToDelete = $(this)
		.closest('tr')
		.data('id');
	$('#confirmDeleteModal').data('id', idToDelete);
	//attaches id to delete to the modal window for processing delete route
}

//modal confirm button confirms delete
function confirmDelete() {
	let idToDelete = $('#confirmDeleteModal').data('id');
	$.ajax({
		method: 'DELETE',
		url: `/tasks/${idToDelete}`
	})
		.then(response => {
			console.log('successful DELETE request to server');
			$('#confirmDeleteModal').modal('toggle');
			$('#confirmDeleteModal').data('id', '');
			//removes id from modal after deletion is confirmed
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

//POST route to server to add task to database
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

//GET route to server to gather task list from database
const getTasks = () => {
	console.log('running getTasks function');

	$.ajax({
		method: 'GET',
		url: '/tasks'
	})
		.then(response => {
			console.log('successful GET route to server');
			renderTasks(response);
		})
		.catch(err => {
			console.log('error on GET route from server: ', err);
		});
};

//renders tasks to the DOM
function renderTasks(list) {
	$('#taskTable').empty();
	for (let task of list) {
		let deadline = new Date(task.deadline).toDateString().slice(0, -4);
		//sets deadline to look like "Sun Aug 18" (strips off year as not needed rn)
		let htmlText = $(`<tr></tr>`);
		//creates jquery object for list object

		htmlText
			.append(`<th scope="row"></th>`)
			.append(`<td>${task.name}</td`) // appends name
			.append(`<td>${deadline}</td>`) // appends deadline
			.append(
				`<td>
				<button
					class="btn btn-outline-dark detailsButton"
					data-toggle="popover"
					title="Task Details"
					data-content="${task.details}">
						...
				</button>
				</td>`
			); // appends button to click for popover with tasks details

		//appends status button - if status is complete, appends "Done!"
		//											- if status is incomplete, appends "To-Do"
		if (task.isDone) {
			htmlText
				.append(
					`<td><button class="statusButton statusDone btn btn-success btn-sm">Done!</td>`
				)
				.addClass('bg-success text-white');
		} else {
			htmlText.append(
				`<td>
					<button
						class="statusButton statusToDo btn
						 btn-secondary btn-sm">To-Do</button>
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
		); // appends delete "X" to toggle confirmation modal to delete item

		htmlText.data('id', task.id); // adds task id to html row
		htmlText.data('task', task); // adds task object to html row
		$('#taskTable').append(htmlText); // adds jquery item to table
	}
}
