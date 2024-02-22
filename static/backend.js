const HEADERS = new Headers();
HEADERS.append("Content-Type", "application/json");

const URL_ROOT = "";
const URL_RESUMO = URL_ROOT + "/api/resumo";
const URL_GRAVA_BEM = URL_ROOT + "/api/grava";
const URL_APAGA_BEM = URL_ROOT + "/api/apaga";
const URL_GRAVA_AMOSTRA = URL_ROOT + "/api/amostra/grava";

export const URL_BEM = URL_ROOT + "/api/amostra/";
export const URL_BEM_SIPAC = URL_ROOT + "/api/sipac/";
export const URL_SEARCH = URL_ROOT + "/search";
export const URL_COMISSAO = URL_ROOT + "/api/comissao";
const URL_SETORES = URL_ROOT + "/api/amostra/setores";
const URL_BENS_DO_SETOR = URL_ROOT + "/api/amostra/setor/";

export async function app_fetch(url, data) {
	const init = {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify(data)
	}

	return fetch(url, init)
		.then((response) => {return response.json()})
}		

export async function app_get(url) {
	const init = {
		method: 'GET',
		headers: HEADERS
	}

	return fetch(url, init)
		.then((response) => {return response.json()})
}		

export async function grava_bem(data) {
	console.log(URL_GRAVA_BEM);
	console.log(data);
	return app_fetch(URL_GRAVA_BEM, data); 
}

export async function apaga_bem(data) {
	console.log(URL_APAGA_BEM);
	return app_fetch(URL_APAGA_BEM, data); 
}

export async function grava_amostra(data) {
	console.log(data);
	return app_fetch(URL_GRAVA_AMOSTRA, data); 
}

export async function pesquisa(tombo) {
	return app_get(URL_BEM + tombo);
}

export async function pesquisa_sipac(tombo) {
	return app_get(URL_BEM_SIPAC + tombo);
}

export async function comissao() {
    return app_get(URL_COMISSAO);
}

export async function setores() {
    return app_get(URL_SETORES);
}

export async function bens_do_setor(codigo) {
    return app_get(URL_BENS_DO_SETOR+codigo);
}

export async function resumo() {
    return app_get(URL_RESUMO);
}
