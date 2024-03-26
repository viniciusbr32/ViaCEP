const addressForm = document.querySelector('#address-form');
const cepInput = document.querySelector('#cep');
const addressInput = document.getElementById('address');
const cityInput = document.getElementById('city');
const neighborhoodInput = document.getElementById('neighborhood');
const regionInput = document.getElementById('region');
const formInputs = document.querySelectorAll('[data-input]');
const closeButton = document.getElementById('close-message');

cepInput.addEventListener('keypress', (event) => {
	const onlyNumbers = /[0-9]/;
	const key = String.fromCharCode(event.keyCode);

	if (!onlyNumbers.test(key)) {
		event.preventDefault();
		return;
	}
});

cepInput.addEventListener('keyup', (e) => {
	const inputValue = e.target.value;

	if (inputValue.length === 8) {
		getAddress(inputValue);
	}
});

const getAddress = async (cep) => {
	toggleLoader();
	cepInput.blur();
	const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;
	const response = await fetch(apiUrl);

	const data = await response.json();

	if (data.erro === true) {
		addressForm.reset();
		toggleLoader();
		toggleMessage('CEP INVALIDO, TENTE NOVAMENTE');
		return;
	}

	if (addressInput.value === '') {
		toggleDisabled();
	}

	addressInput.value = data.logradouro;
	cityInput.value = data.localidade;
	neighborhoodInput.value = data.bairro;
	regionInput.value = data.uf;

	toggleLoader();
};

const toggleLoader = () => {
	const fadeElement = document.querySelector('#fade');
	const loaderElement = document.querySelector('#loader');

	fadeElement.classList.toggle('hide');
	loaderElement.classList.toggle('hide');
};

const toggleMessage = (msg) => {
	const messageElement = document.querySelector('#message');
	const messageElementText = document.querySelector('#message p');
	const fadeElement = document.querySelector('#fade');

	messageElementText.innerText = msg;

	fadeElement.classList.toggle('hide');
	messageElement.classList.toggle('hide');
};

const toggleDisabled = () => {
	if (regionInput.hasAttribute('disabled')) {
		formInputs.forEach((input) => {
			input.removeAttribute('disabled');
		});
	} else {
		formInputs.forEach((input) => {
			input.setAttribute('disabled', 'disabled');
		});
	}
};

closeButton.addEventListener('click', () => toggleMessage());

addressForm.addEventListener('submit', (e) => {
	e.preventDefault();

	toggleLoader();

	setTimeout(() => {
		toggleLoader();
		toggleMessage('Dados cadastrado com sucesso');
		addressForm.reset();
		toggleDisabled();
	}, 1500);
});
