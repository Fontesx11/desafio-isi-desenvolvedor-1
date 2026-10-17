-- migrate:up
CREATE TYPE atributo_duelo AS ENUM ('shooting', 'passing', 'dribbling', 'defending');

CREATE TABLE duelos_partida (
  id                integer           GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  partida_id        integer           NOT NULL REFERENCES partidas (id),
  ordem             integer           NOT NULL,
  clube_atacante_id integer           NOT NULL REFERENCES clubes (id),
  atacante_id       integer           NOT NULL REFERENCES jogadores (id),
  defensor_id       integer           NOT NULL REFERENCES jogadores (id),
  nome_atacante     varchar(100)      NOT NULL,
  nome_defensor     varchar(100)      NOT NULL,
  posicao_atacante  posicao_jogador   NOT NULL,
  posicao_defensor  posicao_jogador   NOT NULL,
  condicao_atacante condicao_jogador  NOT NULL,
  condicao_defensor condicao_jogador  NOT NULL,
  atributo_ataque   atributo_duelo    NOT NULL,
  atributo_defesa   atributo_duelo    NOT NULL,
  valor_ataque      integer           NOT NULL,
  valor_defesa      integer           NOT NULL,
  gol               boolean           NOT NULL
);

-- migrate:down
DROP TABLE duelos_partida;
DROP TYPE atributo_duelo;
