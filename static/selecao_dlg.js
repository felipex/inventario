import {$, html, showMessage} from './guitools.js';
import {pesquisa, grava_bem} from './backend.js' ;


function search_by_tombo() {
    const tombo = $('#tombo_text').value;
    if (tombo == '') {
		showMessage('O número do tombo precisa ser informado.', 'erro');
    } else {
		pesquisa(tombo).then((json) => {
		if (json) {
		    showBem(json);
		} else {
		    showMessage(json['result']['error'], 'erro');
		}
	    });
    }
}


export function showSelecao(div, clearBefore = true) {
    const container = $('#dlg');
    if (clearBefore) container.textContent = '';

    container.appendChild(html('label', 'Tombo', null));
    container.appendChild(html('br', null, null));
    const tombo = html('input', '', {
	id: 'tombo_text',
	name: 'tombo_text',
	type: 'number',
	'class': 'search',
	required: 'true'
    });

    tombo.addEventListener('change', search_by_tombo);
    container.appendChild(tombo);

    const buttom = html('button', 'Pesquisar...', {
	id: 'tombo_search',
	'class': 'search'
    });
    buttom.addEventListener('click', search_by_tombo);

    container.appendChild(buttom);
    container.appendChild(html('div', null, {'class': 'erro'}, 'erro'));


    container.appendChild(html('br', null, null));
    container.appendChild(html('br', null, null));
    container.appendChild(html('button', '+ Novo bem...', {
	id: 'novo_bem'
    }));

    tombo.focus();
}



async function getData() {
    return {
	tombo: $('#tombo').value,
	descricao: $('#descricao').value,
	setor: $('#setor').value,
	situacao: $('#situacao').value,
	campus: $('#campus').value,
	local: $('#local').value,
	obs: $('#observacao').value,
	comissao: $('#usuario').innerText		
    }
}

export async function gravaBemLocalizado(container) {
    const bem = await getData();
    bem['localizado'] = 1;
    return grava_bem(bem)
}

export async function gravaBemNaoLocalizado(container) {
    const bem = await getData();
    bem['localizado'] = 0;
    return grava_bem(bem)
}

