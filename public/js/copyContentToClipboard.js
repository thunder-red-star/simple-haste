function copyContentToClipboard () {
  var copyText = document.getElementById("code");
  // Copy the text inside the pre element to the user's clipboard
  copyText.select();
  copyText.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(copyText.value);
  displayToast("success","Content copied to clipboard");
}