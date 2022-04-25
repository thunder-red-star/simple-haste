function sizeToString (size) {
	// Convert size to units of bytes, kilobytes, megabytes, and so on.
	let sizeUnits = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

	// Find the largest unit that the size is greater than or equal to.
	let i = 0
	while (size >= 1024) {
		size /= 1024
		i++
	}

	// Round the size to two decimal places.
	size = Math.round(size * 100) / 100

	// Return the size and the unit.
	return size + " " + sizeUnits[i]
}