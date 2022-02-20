const $form = document.querySelector('#form')
const $name = document.querySelector('#name')
const $lastName = document.querySelector('#lastName')
const $phone = document.querySelector('#phone')
const $password = document.querySelector('#password')
const $passwordRepeated = document.querySelector('#passwordRepeat')

let name, lastName, phone, password, passwordRepeated
const passwordErrors = []

/////////////////////////////////////////
//Не стал делать реализацию через паттерны и кастомизацию стандартных сообщений об ошибке
// например атрибуты pattern="[a-zA-z]{1,15}" и title="Только латиница, от 1 до 15 символов" внутри элемента input
/////////////////////////////////////////

const submit = event => {
	event.preventDefault()
	$form.classList.add('submit-was-pressed')
	comparePasswordsAndDisplayErrors()
	checkPasswordForErrors()
	checkPhoneNumberForErrors()
	checkLastNameForErrors()
	checkNameForErrors()
	if (checkNoErrorExist()) sendForm()
}

const sendForm = () => {
	console.log(`
	Имя - ${name}
	Фамилия - ${lastName}
	Телефон - ${phone}
	Пароль - ${password}`)
}

const saveInputValues = event => {
	if (event.target.closest('#name')) name = event.target.value = event.target.value.replaceAll(/[^a-zA-Z]/g, '')
	else if (event.target.closest('#lastName')) lastName = event.target.value = event.target.value.replaceAll(/[^a-zA-Z]/g, '')
	else if (event.target.closest('#phone')) fixPhoneNumberInputValue(event)
	else if (event.target.closest('#password')) password = event.target.value = event.target.value.replaceAll(/[^a-zA-Z\d]/g, '')
	else if (event.target.closest('#passwordRepeat')) passwordRepeated = event.target.value = event.target.value.replaceAll(/[^a-zA-Z\d]/g, '')
}

const handleInput = event => {
	$form.classList.remove('submit-was-pressed')
	saveInputValues(event)
}

const fixPhoneNumberInputValue = event => {
	event.target.value !== '7' && event.target.value?.length === 1 && (event.target.value = '7' + event.target.value)
	phone = event.target.value = event.target.value.replaceAll(/[^\d]/g, '').replace(/\d/, '7').slice(0, 11)
}

const checkNameForErrors = () => {
	const closestError = document.querySelector('#name~.error')
	closestError.textContent = ''
	if (!name) closestError.textContent = 'Ввод имени является обязательным (только латиница, от 1 до 15 символов)'
	else name?.length > 15 && (closestError.textContent = 'Имя должно быть не длиннее 15 символов')
	closestError.textContent && $name.focus()
}

const checkLastNameForErrors = () => {
	const closestError = document.querySelector('#lastName~.error')
	closestError.textContent = ''
	if (!lastName) closestError.textContent = 'Ввод фамилии является обязательным (только латиница от 2 символов)'
	else (lastName?.length < 2) && (closestError.textContent = 'Фамилия должна состоять не менее чем из 2 латинских букв')
	closestError.textContent && $lastName.focus()
}

const checkPhoneNumberForErrors = () => {
	const closestError = document.querySelector('#phone~.error')
	closestError.textContent = ''
	if (!phone) closestError.textContent = 'Ввод номера телефона является обязательным'
	else (phone?.length < 11) && (closestError.textContent = 'Номер телефона должен состоять из 11 цифр, начиная с 7')
	closestError.textContent && $lastName.focus()
}

const checkPasswordForErrors = () => {
	const closestError = document.querySelector('#password~.error')
	closestError.textContent = ''
	passwordErrors.length = 0
	if (!password) closestError.textContent = 'Ввод пароля является обязательным (от 6 символов, должен содержать хотя бы одну заглавную цифру и одну цифру)'
	else {
		if (password.length < 6) passwordErrors.push('Минимальная длина пароля 6 символов')
		if (!password.match(/[A-Z]/)) passwordErrors.push('Пароль должен содержать хотя бы одну заглавную букву')
		if (!password.match(/[a-z]/)) passwordErrors.push('Пароль должен содержать хотя бы одну строчную букву')
		if (!password.match(/[0-9]/)) passwordErrors.push('Пароль должен содержать хотя бы одну цифру')
	}
	passwordErrors.forEach(item => {
		const errorString = document.createElement('p')
		errorString.classList.add('error')
		errorString.textContent = item
		closestError.append(errorString)
	})
	closestError.textContent && $password.focus()
}

const comparePasswordsAndDisplayErrors = () => {
	const closestError = document.querySelector('#passwordRepeat~.error')
	closestError.textContent = ''
	if (!passwordRepeated) closestError.textContent = 'Поле необходимо заполнить'
	else if (password !== passwordRepeated) closestError.textContent = 'Пароли не совпадают'
	closestError.textContent && $passwordRepeated.focus()
}

const checkNoErrorExist = () => {
	let result = true
	document.querySelectorAll('p.error').forEach(element => {
		if (element.textContent) result = false
	})
	return result
}

$form.addEventListener('submit', submit)
$form.addEventListener('input', handleInput)