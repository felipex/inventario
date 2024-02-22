select distinct principal.codigo as codigo, principal.nome,
    (select codigo from setores where substr(sipac.setor,1,4) = setores.codigo) as codigomae,
    (select nome from setores where substr(sipac.setor,1,4) = setores.codigo) as nomemae,
    (select count(*) from amostra, sipac where amostra.tombo = sipac.tombo and sipac.setor = principal.codigo) as total,
    (select count(*) from inventario, sipac where inventario.tombo = sipac.tombo and sipac.setor = principal.codigo) as conferidos
from amostra 
inner join sipac on sipac.tombo = amostra.tombo
inner join setores as principal on principal.codigo = sipac.setor
order by codigo;
