# SEEDF — Protótipo com banco JSON

Protótipo acadêmico com painel do professor: **Presenças, Provas, Atividades, Agenda e Notas**.

## Estrutura

- `index.html` — estrutura da aplicação.
- `style.css` — estilos.
- `script.js` — lógica e carregamento dos dados.
- `data/banco.json` — banco de dados inicial em JSON.

## Como funciona o banco

O `script.js` carrega `data/banco.json` com `fetch()` quando a aplicação é aberta. Os dados de alunos, presenças, provas, atividades, agenda e notas ficam separados do código da interface.

As alterações de presença continuam sendo salvas no `localStorage` do navegador. Assim, o JSON funciona como a base inicial e o navegador mantém as alterações feitas pelo usuário.

> **Importante:** um site hospedado somente no GitHub Pages consegue ler o JSON, mas não consegue gravar alterações de volta no arquivo `banco.json` do GitHub. Para um banco compartilhado e gravação real entre usuários, será necessário adicionar um backend ou serviço de banco/API em uma próxima etapa.

## Como testar

Como o projeto usa `fetch()` para ler o JSON, é recomendado abrir pelo GitHub Pages ou por um servidor local. Abrir `index.html` diretamente como `file://` pode bloquear o carregamento do JSON por segurança do navegador.

### Servidor local com Python

Dentro da pasta do projeto:

```bash
python -m http.server 8000
```

Depois abra:

`http://localhost:8000`

## Como publicar no GitHub Pages

Envie **todos os arquivos e pastas**, incluindo a pasta `data` e o arquivo `data/banco.json`.

No GitHub:

1. Acesse **Settings → Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch**.
3. Selecione `main` e `/ (root)`.
4. Salve e aguarde a publicação.

## Interações implementadas

- Navegação entre módulos.
- Grade de frequência clicável.
- Presença/falta persistida no navegador via `localStorage`.
- Indicadores de alunos, presenças, faltas e frequência.
- Dados iniciais carregados de `data/banco.json`.
- Páginas de provas, atividades, agenda e notas alimentadas pelo JSON.
- Alternância entre modo claro e escuro.
- Layout responsivo para celular.
