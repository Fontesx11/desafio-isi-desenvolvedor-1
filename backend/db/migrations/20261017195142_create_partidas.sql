-- migrate:up
CREATE TABLE partidas (
  id                 integer         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  mandante_id        integer         NOT NULL REFERENCES clubes (id),
  visitante_id       integer         NOT NULL REFERENCES clubes (id),
  gols_mandante      integer         NOT NULL,
  gols_visitante     integer         NOT NULL,
  formacao_mandante  formacao_clube  NOT NULL,
  formacao_visitante formacao_clube  NOT NULL,
  jogada_em          timestamptz     NOT NULL DEFAULT now()
);

-- migrate:down
DROP TABLE partidas;
