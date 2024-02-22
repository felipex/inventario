import sqlite3

connection = sqlite3.connect('database.db')


#with open('schema.sql') as f:
#    connection.executescript(f.read())

cur = connection.cursor()

cur.execute("INSERT INTO inventario (tombo, descricao, setor, situacao, campus, local, obs, comissao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            ('15621', 'DESFIBRILADOR LIFE 400 FUTURA', '110105 - NÚCLEO DE PERÍCIAS E SEGURANÇA DO TRABALHO', 'Ocioso', 'Juazeiro do Norte', 'K01', 'obs.: 1', 'Felipe')
            )


connection.commit()
connection.close()
