// Toasts

let currentlyDisplayedToasts = [];

function displayToast (type, message) {
  // There are four types of toasts: success, error, warning, info.
  // The toast will be displayed for 3 seconds. There should be a rectangle on the bottom of the toast that shows how long until it disappears.
  // The toast will be displayed in the top right corner of the screen.

	// Create toast element
	var toast = document.createElement('div');
	toast.className = 'toast';
	if (type == 'success') {
		toast.className += ' toast-success';
	} else if (type == 'error') {
		toast.className += ' toast-error';
	} else if (type == 'warning') {
		toast.className += ' toast-warning';
	} else if (type == 'info') {
		toast.className += ' toast-info';
	} else {
		return;
	}

	// Create toast message
	var toastMessage = document.createElement('div');
	toastMessage.className = 'toast-message';
	toastMessage.className += ' float-left';
	toastMessage.innerHTML = message;

	// Create toast close button
	var toastClose = document.createElement('div');
	toastClose.className = 'toast-close';
	toastClose.className += ' float-right';
	toastClose.innerHTML = '&times;';
	toastClose.onclick = function () {
		toast.parentNode.removeChild(toast);
	}

	// Append toast elements
	toast.appendChild(toastMessage);
	toast.appendChild(toastClose);
	document.body.appendChild(toast);

	// Add toast to currentlyDisplayedToasts array
	currentlyDisplayedToasts.push(toast);

	// Set timeout to remove toast
	setTimeout(function () {
		// Transition toast to opacity 0
		toast.style.opacity = 0;
		toast.parentNode.removeChild(toast);
	}, 5000);

	// Remove toast from currentlyDisplayedToasts array
	currentlyDisplayedToasts.splice(currentlyDisplayedToasts.indexOf(toast), 1);
}