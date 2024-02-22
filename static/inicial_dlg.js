import {$, html, updateSecao} from './guitools.js';
import { 
    comissao, 
    setores, 
    bens_do_setor, 
    pesquisa, 
    pesquisa_sipac, 
    grava_amostra, 
    resumo,
    apaga_bem
     } from './backend.js';
     
import { gravaBemLocalizado, gravaBemNaoLocalizado } from './selecao_dlg.js';


function mostra_resumo(div) {
	resumo()
		.then(data => {
			console.log(data);
			div.appendChild(html('br'));
			div.appendChild(html('br'));
			div.appendChild(html('br'));
            div.appendChild(html('span', 'Total de bens no SIPAC: ', {'style': 'font-size: 2rem'}));
            div.appendChild(html('strong', data['total_sipac'], {'style': 'font-size: 2rem'}));
			div.appendChild(html('br'));
            div.appendChild(html('span', 'Total de bens da amostra: ', {'style': 'font-size: 2rem'}));
            div.appendChild(html('strong', data['total_amostra'], {'style': 'font-size: 2rem'}));
			div.appendChild(html('br'));
            div.appendChild(html('span', 'Total de bens conferidos: ', {'style': 'font-size: 2rem'}));
            div.appendChild(html('strong', data['total_conferidos'], {'style': 'font-size: 2rem'}));
		})
}

export function showInicial() {
    const div = $('#dlg');
    div.textContent = '';

    comissao()
        .then(data => {
            for (const d of data) {
                const button = html('button', d.nome, null)
                div.appendChild(button);
                button.addEventListener('click', (e) => {
                    updateSecao(e.target.innerText);
                    showSetores('#dlg');
                })               
            }   
            mostra_resumo(div);                   
        });        
}


function showSetor(codigo) {
    const div = $('#dlg');
    div.textContent = '';

    const button = html('button', 'Voltar', {'class': 'toolbutton'});
    button.addEventListener('click', ()=>showSetores());
    div.appendChild(button);

    div.appendChild(html('br', null, null));
    div.appendChild(html('br', null, null));
    
    bens_do_setor(codigo)
        .then(data => {
            div.appendChild(html('h3', `${data[0].codigo} - ${data[0].nome}`));
            div.appendChild(html('br', null, null));
            const ul = html('ul', null, {'class': 'bens'});
            for (const d of data) {
                const bem = html('span', `${d.tombo} - ${d.descricao}`, );
                const link = html('a', null, {href: "javascript:void(0)"});
                link.appendChild(bem);
                link.addEventListener('click', () => {
                	pesquisa(d.tombo)
                		.then((json) => {
                			showBem(json);
                		})
                });
                const li = html('li', null, null);                
                li.appendChild(link);

                const resumo = html('div', null, {'class': 'resumo'}); 
                if (d['localizado'] == 1) resumo.appendChild(html('strong', 'Conferido e localizado'));
                if (d['localizado'] == 0) resumo.appendChild(html('strong', 'Conferido e NÃO localizado'));
                if (d['localizado'] == null) resumo.appendChild(html('span', 'AINDA NÃO CONFERIDO'));
                link.appendChild(resumo);
                if (d['localizado'] != null) li.classList.add('completo');

                ul.appendChild(li);
            }
            div.appendChild(ul);
            }            
        );
}

export function showSetores() {
    const div = $('#dlg');
    div.textContent = '';

//    const voltar = html('button', 'Voltar', null);
    const voltar = html('button', 'Voltar', {'class': 'toolbutton'});
    voltar.addEventListener('click', ()=>showInicial());
    div.appendChild(voltar);

    const novo = html('button', 'Pesquisar...', {'class': 'localizado toolbutton'});
    novo.addEventListener('click', ()=>novoBem());
    div.appendChild(novo);

    setores()
        .then(data => {
            const ul = html('ul', null, {'class': 'secoes'});
            for (const d of data) {
                let nome = `${d.codigo} - ${d.nome}`;
                if (d.codigo.length == 6) {
                    nome = nome + ` (${d.codigomae} - ${d.nomemae})`;
                }
                
                const setor = html('span', nome);
                const link = html('a', null, {href: "javascript:void(0)"});
                link.appendChild(setor);
                link.addEventListener('click', () => showSetor(d.codigo));
                const li = html('li', null, null);                
                li.appendChild(link);

                const resumo = html('div', null, {'class': 'resumo'});                
                resumo.appendChild(html('span', 'Total de bens: '));
                resumo.appendChild(html('strong', d['total']));
                resumo.appendChild(html('span', '  Bens conferidos: '));
                resumo.appendChild(html('strong', d['conferidos'] || '0' ));
                link.appendChild(resumo);
                if (d['total'] == d['conferidos']) li.classList.add('completo');
                
                ul.appendChild(li);
            }
            div.appendChild(ul);
        });
}

function showBem(data)  {
    const div = $('#dlg');
    div.textContent = '';
   	console.log(data);

    div.appendChild(html('label', 'Tombo', null));
    div.appendChild(html('br', null, null));
    const tombo = html('input', null, {value: data['tombo'], disabled:''}, 'tombo');
    div.appendChild(tombo);
    div.appendChild(html('br', null, null));
    div.appendChild(html('label', 'Descrição', null));
    div.appendChild(html('br', null, null));
    div.appendChild(html('textarea', data['descricao'], {disabled: 'disabled'}, 'descricao'));
    div.appendChild(html('br', null, null));
    div.appendChild(html('label', 'Setor', null));
    div.appendChild(html('br', null, null));
    div.appendChild(html('textarea', `${data['codigo']} - ${data['nome']}`, {disabled: 'disabled'}, 'setor'));

    div.appendChild(html('br', null, null));
    div.appendChild(html('label', 'Situação:', null));
    div.appendChild(html('br', null, null));	

    const situacao = html('select', null, null, 'situacao');
    situacao.appendChild(html('option', 'Bom', {value: 'Bom'})); 
    situacao.appendChild(html('option', 'Ocioso', {value: 'Ocioso'})); 
    situacao.appendChild(html('option', 'Recuperável', {value: 'Recuperável'})); 
    situacao.appendChild(html('option', 'Antieconômico', {value: 'Antieconômico'})); 
    situacao.appendChild(html('option', 'Irrecuperável', {value: 'Irrecuperável'})); 
    div.appendChild(situacao);
    div.appendChild(html('br', null, null));

    div.appendChild(html('label', 'Campus:', null));
    div.appendChild(html('br', null, null));
    const campus = html('select', null, null, 'campus');
    campus.appendChild(html('option', 'Juazeiro do Norte', {value: 'Juazeiro do Norte'})); 
    campus.appendChild(html('option', 'Crato', {value: 'Crato'})); 
    campus.appendChild(html('option', 'Barbalha', {value: 'Barbalha'})); 
    campus.appendChild(html('option', 'Brejo Santo', {value: 'Brejo Santo'})); 
    campus.appendChild(html('option', 'Icó', {value: 'Icó'}));
    console.log(data['campus']);
    div.appendChild(campus);
    if (data['campus']) {
    	$(`option[value="${data['campus']}"]`).selected = true;
    }

    const local = data['local'] ? data['local'] : '';
    div.appendChild(html('br', null, null));
    div.appendChild(html('label', 'Local:', null));
    div.appendChild(html('br', null, null));
    div.appendChild(html('input', null, {placeholder: 'Bloco Sala', value: local}, 'local'));
    div.appendChild(html('br', null, null));
    div.appendChild(html('label', 'Observação:', null));
    div.appendChild(html('br', null, null));
    div.appendChild(html('textarea', data['obs'], null, 'observacao'));

    div.appendChild(html('br', null, null));
    div.appendChild(html('br', null, null));

    const botoes = html('div', null, {
	class: 'botoes'
    });
    div.appendChild(botoes);

    const localizado = html('button', 'Localizado', {
	class: 'localizado'
    });
    localizado.addEventListener('click', (e) => {
        if ($('#local').value.trim().length > 0) {
        	gravaBemLocalizado('#dlg')
			    .then((json) => {
				    showSetor(data['codigo']); // Código do setor
           })    	
        } else {
           alert('O campo Local é obrigatório');
        }
     });

    botoes.appendChild(localizado);

    const naolocalizado = html('button', 'Não Localizado', {
	class: 'naolocalizado'
    });
    naolocalizado.addEventListener('click', (e) => {
    	gravaBemNaoLocalizado('#dlg')
			.then((json) => {
				showSetor(data['codigo']); // Código do setor
	})    	
    });
    botoes.appendChild(naolocalizado);

    const voltar = html('button', 'Cancelar', {
	class: 'cancelar'
    });
    voltar.addEventListener('click', (e) => showSetor(data['codigo'])); // Código do setor
    botoes.appendChild(voltar);

	if (data['situacao']) {
		const voltar = html('button', 'Desfaz Conf.', {
		class: ''
		});
		voltar.addEventListener('click', (e) => {
			if (confirm('Deseja realmente apagar a conferência deste bem?')) {
				apaga_bem(data);
				showSetor(data['codigo']);
			} else {
				console.log('Não apaga');
			}
		}); // Código do setor
		botoes.appendChild(voltar);	
	}
}


function novoBem()  {
    const div = $('#dlg');
    div.textContent = '';

    const voltar = html('button', 'Voltar', {'class': 'toolbutton'});
    voltar.addEventListener('click', ()=>showSetores());
    div.appendChild(voltar);

    div.appendChild(html('br', null, null));
    div.appendChild(html('br', null, null));
    div.appendChild(html('label', 'Tombo', null));
    div.appendChild(html('br', null, null));
    const tombo = html('input', null, {type: 'number'}, 'tombo');
    tombo.addEventListener('change', (e)=> {
    	pesquisa_sipac($('#tombo').value)
		    .then((json) => {
			    mostraNovo(json, div);
			    console.log(json);
        })
    });
    div.appendChild(tombo);
    tombo.focus();
    const busca = html('button', 'buscar', {
    class: 'localizado toolbutton'
    });
    busca.addEventListener('click', (e) => {
    	pesquisa_sipac($('#tombo').value)
		    .then((json) => {
			    mostraNovo(json, div);
			    console.log(json);
	    })    	
    });
    div.appendChild(busca);
}

function mostraNovo(data, div) {
    console.log(data);
    let resumo = $('#resumo');
    if (!resumo) resumo = html('div', null, null, 'resumo');
    resumo.innerHTML = '';
    
    resumo.appendChild(html('br', null, null));
    resumo.appendChild(html('label', 'Descrição:', null));
    resumo.appendChild(html('br', null, null));
    resumo.appendChild(html('textarea', data['descricao'], null));

    resumo.appendChild(html('label', 'Setor:', null));
    resumo.appendChild(html('br', null, null));
    resumo.appendChild(html('textarea', `${data['codigo']} - ${data['nome']}`, null));

    if (data['amostra'] == 1) {
        resumo.appendChild(html('label', 'Este bem já está na amostra.', {'style': 'font-size: 2rem;'}));
    } else {

        const inclui = html('button', 'Incluir na amostra', {
	    class: 'localizado'
        });
        inclui.addEventListener('click', (e) => {
        	const data = {'tombo': $('#tombo').value};	
        	grava_amostra(data)
        	    .then((datar) => {
        	        console.log(datar);
                	pesquisa(datar.tombo)
                		.then((json) => {
                			showBem(json);
                		})
        	    });
        	//showSetores();
        });
        resumo.appendChild(inclui);
    }
    div.appendChild(resumo);
}

