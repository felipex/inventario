
export function $(param) {
	return document.querySelector(param);
}

export function html(tag, content=null, options=null, id=null) {
	const element = document.createElement(tag);
	element.textContent = content ? content : '';
	if (id) element.setAttribute('id', id);
	if (options) {
		const keys = Object.keys(options);
		
		for (let i in keys) {
			element.setAttribute(keys[i], options[keys[i]]);
		}
	}
	return element;
}

export function create(tag, content=null, options=null, id=null) {
	const element = document.createElement(tag);
	element.textContent = content ? content : '';
	if (id) element.setAttribute('id', id);
	if (options) {
		const keys = Object.keys(options);
		
		for (let i in keys) {
			element.setAttribute(keys[i], options[keys[i]]);
		}
	}
	return element;
}


export function showMessage(msg, div) {
    const container = document.getElementById(div);
    container.textContent = '';
    const span = create('span', msg, {'class': 'erro'});
    container.appendChild(span);
}

export function updateSecao(nome) {
    const usuario = $('#usuario');
    usuario.innerText = nome;
}

