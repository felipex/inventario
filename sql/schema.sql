CREATE TABLE inventario (
    tombo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    setor TEXT NOT NULL,
    situacao TEXT NOT NULL,
    campus TEXT NOT NULL,
    local TEXT NOT NULL,
    obs TEXT NULL,
    localizado INTEGET NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    comissao TEXT NOT NULL
);


