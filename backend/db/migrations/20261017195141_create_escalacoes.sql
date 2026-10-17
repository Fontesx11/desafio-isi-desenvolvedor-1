-- migrate:up
CREATE TABLE escalacoes (
  clube_id   integer      NOT NULL REFERENCES clubes (id),
  jogador_id integer      NOT NULL UNIQUE REFERENCES jogadores (id),
  criado_em  timestamptz  NOT NULL DEFAULT now(),
  PRIMARY KEY (clube_id, jogador_id)
);

-- migrate:down
DROP TABLE escalacoes;
