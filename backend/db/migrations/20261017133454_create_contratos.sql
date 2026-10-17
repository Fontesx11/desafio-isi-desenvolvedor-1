-- migrate:up
CREATE TYPE situacao_contrato AS ENUM ('ATIVO', 'ENCERRADO', 'RESCINDIDO');

CREATE TABLE contratos (
  id             integer            GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  jogador_id     integer            NOT NULL REFERENCES jogadores (id),
  clube_id       integer            NOT NULL REFERENCES clubes (id),
  valor_compra   decimal(6,2)       NOT NULL,
  fidelidade_ate timestamptz        NOT NULL,
  situacao       situacao_contrato  NOT NULL,
  iniciado_em    timestamptz        NOT NULL DEFAULT now(),
  encerrado_em   timestamptz
);

-- migrate:down
DROP TABLE contratos;
DROP TYPE situacao_contrato;
