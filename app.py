import sqlite3
from flask import Flask, render_template, jsonify, request
import json


app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('sql/database.db')
    conn.row_factory = sqlite3.Row
    return conn

def select(COMMAND):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(COMMAND)
    rows = cursor.fetchall()
    columns = [col[0] for col in cursor.description]
    data = [dict(zip(columns, row)) for row in rows]
    cursor.close()
    conn.close()
    return data

def execute(COMMAND, data=None):
	conn = get_db_connection()
	cursor = conn.cursor()
	if (data):
		cursor.execute(COMMAND, data)
	else:
		cursor.execute(COMMAND)
		
	conn.commit()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/setores')
def setores():
    data = select('SELECT * FROM setores order by codigo;')
    return jsonify(data)


@app.route('/api/comissao')
def comissao():
    data = select('SELECT * FROM comissao order by nome;')
    return jsonify(data)


@app.route('/api/setor/<int:codigo>')
def setor(codigo):
    data = select(f'''SELECT * FROM setores where codigo = {codigo}''')
    return jsonify(data[0])


@app.route('/api/sipac/<int:tombo>')
def sipac(tombo):
    
    data = select(f'''
    select tombo, sipac.id, descricao, setores.codigo, setores.nome,
	(select count(*) from amostra where amostra.tombo = sipac.tombo) as amostra
    from sipac
    inner join setores on codigo = sipac.setor
    where tombo = {tombo};
    ''')
    if (len(data) > 0):
    	return jsonify(data[0])
    	
    return jsonify({'tombo': 0})


@app.route('/api/amostra/<int:tombo>')
def amostra(tombo):
	## Procura primeiro no inventário pra saber se já foi conferido e pegar as informações atualizadas.
    data = select(f'''
select inventario.tombo, sipac.descricao, setores.codigo, setores.nome, situacao, campus, local, comissao, obs
from inventario
inner join sipac on sipac.tombo = inventario.tombo
inner join setores on codigo = sipac.setor
where inventario.tombo = {tombo};
    ''')
    
    ## Se não tiver nada no inventário ainda pega as informações do sipac mesmo.
    if (len(data) == 0):
        data = select(f'''
        select amostra.tombo, sipac.id, descricao, setores.codigo, setores.nome 
        from amostra 
        inner join sipac on sipac.tombo = amostra.tombo
        inner join setores on codigo = sipac.setor
        where amostra.tombo = {tombo};
        ''')
    return jsonify(data[0])


@app.route('/api/amostra/setores')
def amostra_setores():
    data = select(f'''
select distinct principal.codigo as codigo, principal.nome,
    coalesce((select codigo from setores where substr(sipac.setor,1,4) = setores.codigo), '') as codigomae,
    coalesce((select nome from setores where substr(sipac.setor,1,4) = setores.codigo), '') as nomemae,
    (select count(*) from amostra, sipac where amostra.tombo = sipac.tombo and sipac.setor = principal.codigo) as total,
    (select count(*) from inventario, sipac where inventario.tombo = sipac.tombo and sipac.setor = principal.codigo) as conferidos
from amostra 
inner join sipac on sipac.tombo = amostra.tombo
inner join setores as principal on principal.codigo = sipac.setor
order by codigo;
   ''')
    return jsonify(data)


@app.route('/api/amostra/setor/<int:setor>')
def amostra_por_setor(setor):
    data = select(f'''
select amostra.tombo, sipac.id, descricao, setores.codigo, setores.nome,
(select localizado from inventario where inventario.tombo = sipac.tombo) as localizado
from amostra 
inner join sipac on sipac.tombo = amostra.tombo
inner join setores on codigo = sipac.setor
where sipac.setor = {setor};
    ''')
    return jsonify(data)


@app.route('/api/resumo')
def resumo():
    total_sipac = select('select count(*) as total from sipac;');
    total_amostra = select('select count(*) as total from amostra;');
    total_conferidos = select('select count(*) as total from inventario;');
    
    data = {
    	'total_sipac': total_sipac[0]['total'],
    	'total_amostra': total_amostra[0]['total'],
    	'total_conferidos': total_conferidos[0]['total']
    }
    return jsonify(data)


def grava_inventario(data):
	execute(f'DELETE from inventario where tombo = {data["tombo"]};')
	
	execute('''
	INSERT INTO inventario (tombo, descricao, setor, situacao, campus, local, obs, localizado, comissao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
    (data['tombo'], 
    data['descricao'], 
    data['setor'], 
    data['situacao'], 
    data['campus'], 
    data['local'],
    data['obs'],
    data['localizado'],
    data['comissao']
    ))

def apaga_inventario(data):
	execute(f'DELETE from inventario where tombo = {data["tombo"]};')


def inclui_amostra(tombo):
	execute(f'DELETE from amostra where tombo = {tombo};')
	
	execute(f'INSERT INTO amostra (tombo) VALUES ({tombo})');


@app.route('/api/grava', methods=['POST'])
def grava():
	content_type = request.headers.get('Content-Type')
	if (content_type == 'application/json'):	
		data = json.loads(request.data)
		grava_inventario(data)
	else:
		print('Não é json')
	return {'data': '1'}


@app.route('/api/apaga', methods=['POST'])
def apaga():
	content_type = request.headers.get('Content-Type')
	if (content_type == 'application/json'):	
		data = json.loads(request.data)
		apaga_inventario(data)
	else:
		print('Não é json')
	return {'data': '1'}


@app.route('/api/amostra/grava', methods=['POST'])
def grava_amostra():
	content_type = request.headers.get('Content-Type')
	if (content_type == 'application/json'):	
		data = json.loads(request.data)
		inclui_amostra(data['tombo'])
		return jsonify(data)
	else:
		print('Não é json')
	return {'data': '1'}


