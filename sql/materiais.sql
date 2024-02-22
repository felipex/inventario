select sipac.tombo, descricao, setores.codigo, setores.nome
--select setor, nome, count(*)
from sipac
inner join setores on codigo = sipac.setor
--where descricao like '%estante industrial%' and setor like '110409'
where descricao like '%sistema%'
--where setor like '1103%'
--group by setor, nome
--order by setor, nome;
order by sipac.tombo

