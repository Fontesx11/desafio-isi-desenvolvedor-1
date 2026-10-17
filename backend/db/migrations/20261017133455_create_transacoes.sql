-- migrate:up
CREATE TYPE tipo_transacao AS ENUM ('COMPRA', 'VENDA');

CREATE TABLE transacoes (
  id             integer         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  clube_id       integer         NOT NULL REFERENCES clubes (id),
  jogador_id     integer         NOT NULL REFERENCES jogadores (id),
  nome_jogador   varchar(100)    NOT NULL,
  tipo           tipo_transacao  NOT NULL,
  valor          decimal(6,2)    NOT NULL,
  taxa           decimal(6,2)    NOT NULL,
  multa          decimal(6,2)    NOT NULL,
  lucro          decimal(7,2),
  variacao_caixa decimal(8,2)    NOT NULL,
  criado_em      timestamptz     NOT NULL DEFAULT now()
);

-- migrate:down
DROP TABLE transacoes;
DROP TYPE tipo_transacao;
