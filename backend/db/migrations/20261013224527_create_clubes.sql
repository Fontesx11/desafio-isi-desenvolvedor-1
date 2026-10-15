-- migrate:up
CREATE TYPE formacao_clube AS ENUM ('3-1', '2-2', '2-1-1', '1-2-1');

CREATE TABLE clubes (
  id        integer         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome      varchar(60)     NOT NULL,
  sigla     char(3)         NOT NULL UNIQUE,
  caixa     decimal(10,2)   NOT NULL DEFAULT 300.00,
  formacao  formacao_clube,
  criado_em timestamptz     NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX clubes_nome_unico ON clubes (lower(nome));

-- migrate:down
DROP TABLE clubes;
DROP TYPE formacao_clube;
