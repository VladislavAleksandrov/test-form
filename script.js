const $form = document.querySelector(".js-form");
const $errors = [...$form.querySelectorAll(".js-error")];

$form.addEventListener("input", handleInput, false);
$form.addEventListener("submit", handleSubmit, false);

const request = {
	'firstName': '',
	'secondName': '',
	'phone': '',
	'password': '',
	'passwordRepeat': ''
}

function saveRequest(request) {
	for (const name in request) {
		request[name] = $form.elements[name]?.value
	}
}

function handleInput() {
	$errors.forEach(($error) => ($error.textContent = ""));
}

function handleSubmit(event) {
	event.preventDefault();
	[...$form.elements].forEach(showErrors);
	saveRequest(request)
	if ($form.checkValidity()) {
		console.log(`
firstName - ${request.firstName[0].toUpperCase() + request.firstName.slice(1).toLowerCase()}
secondName - ${request.secondName[0].toUpperCase() + request.secondName.slice(1).toLowerCase()}
phone - ${request.phone}
password - ${request.password}
	`)
		for (const name in request) {
			request[name] = ''
		}
		$form.reset()
	}
}

function showErrors($input) {
	const {validity} = $input;

	let errors = [];
	if (validity.valueMissing) errors.push("Поле не может быть пустым");
	if (validity.tooShort) errors.push(`Не меньше ${$input.minLength} символов`);
	if (validity.tooLarge) errors.push(`Не больше ${$input.maxLength} символов`);
	if (validity.patternMismatch) {
		if ($input.name === "password") {
			if ($input.value.match(/[a-zA-Z]/)) errors.push('Латиница недопустима')
			if (!$input.value.match(/[0-9]/)) errors.push('Хотя бы 1 цифра')
			if (!$input.value.match(/[а-я]/)) errors.push('Хотя бы 1 заглавная буква')
			if (!$input.value.match(/[А-Я]/)) errors.push('Хотя бы 1 строчная буква')
		} else errors.push($input.getAttribute("data-pattern-error"));
	}
	if ($input.name === "passwordRepeat") {
		if (request.password === request.passwordRepeat) $input.setCustomValidity('')
		else {
			$input.setCustomValidity('Пароли не совпадают')
			errors.push('Пароли не совпадают')
		}
	}

	if (errors.length) $input.nextElementSibling.textContent = errors.join("\n");
}

