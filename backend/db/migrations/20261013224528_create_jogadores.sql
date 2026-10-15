-- migrate:up
CREATE TYPE posicao_jogador AS ENUM ('GOL', 'ZAG', 'LAT', 'MEI', 'ATA');
CREATE TYPE condicao_jogador AS ENUM ('APTO', 'MAL_CONDICIONADO', 'DOENTE');

CREATE TABLE jogadores (
  id            integer           GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome          varchar(100)      NOT NULL,
  posicao       posicao_jogador   NOT NULL,
  agilidade     integer           NOT NULL,
  idade         integer           NOT NULL,
  valor_base    decimal(6,2)      NOT NULL,
  condicao      condicao_jogador  NOT NULL,
  clube_id      integer           REFERENCES clubes (id),
  velocidade    integer           NOT NULL,
  finalizacao   integer           NOT NULL,
  passe         integer           NOT NULL,
  drible        integer           NOT NULL,
  defesa        integer           NOT NULL,
  fisico        integer           NOT NULL,
  potencial     integer           NOT NULL,
  excluido_em   timestamptz,
  criado_em     timestamptz       NOT NULL DEFAULT now(),
  atualizado_em timestamptz       NOT NULL DEFAULT now()
);

-- migrate:down
DROP TABLE jogadores;
DROP TYPE condicao_jogador;
DROP TYPE posicao_jogador;