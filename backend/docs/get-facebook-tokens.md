# Configurar API do Facebook/Instagram — tokens e publicação

Tutorial de ponta a ponta: gerar o token de usuário, trocar por um de longa
duração, pegar o Page Access Token, achar a conta do Instagram vinculada, e
usar tudo isso pra publicar feed e story no n8n.

Convenção deste documento: salve cada resposta bruta da API localmente em
`backend/.connections/*.json` (pasta já ignorada pelo git) — é o padrão que já
vínhamos usando pra não perder os IDs/tokens gerados em cada etapa.

---

## 0. Pré-requisitos

- Você é **Administrador** do app em [developers.facebook.com/apps](https://developers.facebook.com/apps).
- O app tem os produtos **Facebook Login** e **Instagram Graph API** adicionados.
- A conta do Instagram do TrabalhaRN está como **Business/Creator** e
  **vinculada** à página do Facebook (Instagram → Configurações → Conta → Vinculado).
- O app pode ficar em modo **Desenvolvimento** — como só a sua própria página é
  usada, não é preciso passar por App Review do Meta, só precisa que seu
  usuário esteja cadastrado como admin/testador no app.

---

## 1. Token de usuário de curta duração

No [Graph API Explorer](https://developers.facebook.com/tools/explorer), selecione
o app e clique em "Gerar Access Token" pedindo as permissões:

- `pages_show_list`
- `pages_read_engagement`
- `pages_manage_posts`
- `instagram_basic`
- `instagram_content_publish`
- `business_management`

Isso gera um token de usuário válido por ~1-2h. Salve em
`.connections/access_short_token.json` só pra referência — ele expira rápido
e não é usado em mais nada além do passo 2.

---

## 2. Trocar por token de usuário de longa duração (60 dias)

```
GET https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id={APP_ID}&client_secret={APP_SECRET}&fb_exchange_token={SHORT_LIVED_USER_TOKEN}
```

- `APP_ID` e `APP_SECRET`: em **Configurações → Básico** do app no Meta for
  Developers. O App Secret fica oculto atrás de um botão "Mostrar" (pede a
  senha do Facebook de novo).
- **Atenção à barra final**: `/oauth/access_token/?...` (com `/` antes do
  `?`) quebra e devolve um erro enganoso ("client_secret should not be
  passed..."). Tem que ser `/oauth/access_token?...`, sem barra.

A resposta traz `access_token` (o de longa duração) e `expires_in` (segundos,
deve dar algo perto de `5184000` = 60 dias). Salve em
`.connections/access_big_token.json`.

### Conferir a validade

```
GET https://graph.facebook.com/debug_token?input_token={TOKEN}&access_token={APP_ID}|{APP_SECRET}
```

(o `access_token` aqui é literalmente `APP_ID` e `APP_SECRET` colados com um
`|` no meio). A resposta traz `expires_at` como timestamp Unix — ou use a
versão visual em [developers.facebook.com/tools/debug/accesstoken](https://developers.facebook.com/tools/debug/accesstoken/).
Salve em `.connections/debug_big_token.json`.

---

## 3. Page Access Token e Page ID

```
GET https://graph.facebook.com/v21.0/me/accounts?access_token={LONG_LIVED_USER_TOKEN}
```

Retorna a lista de páginas que você administra:

```json
{
  "data": [
    {
      "access_token": "EAAxxxxx...",
      "category": "...",
      "name": "TrabalhaRN",
      "id": "00000000"
    }
  ]
}
```

Na entrada do TrabalhaRN: `id` é o **PAGE_ID**, `access_token` é o
**PAGE_ACCESS_TOKEN**. Salve em `.connections/accounts.json`.

**É esse `access_token` — não o token de usuário do passo 2 — que vai ser
usado em tudo daqui pra frente**: publicar no Facebook, publicar no
Instagram, e no `debug_token`.

Se a lista vier vazia ou sem a página do TrabalhaRN, faltou marcar
`pages_show_list`/`pages_read_engagement` no passo 1 — regenere o token de
usuário com esses escopos.

Rode o `debug_token` (seção anterior) nesse `PAGE_ACCESS_TOKEN`: se
`expires_at` vier `0`, o Graph API está confirmando que ele **não expira por
tempo** (só invalida se você trocar a senha, revogar o app, ou remover a
página das suas contas).

---

## 4. ID da conta do Instagram vinculada

```
GET https://graph.facebook.com/v21.0/{PAGE_ID}?fields=instagram_business_account&access_token={PAGE_ACCESS_TOKEN}
```

```json
{
  "instagram_business_account": { "id": "1000000000" },
  "id": "1000000"
}
```

O `instagram_business_account.id` é o **IG_USER_ID**, usado em toda chamada
de publicação no Instagram. Salvo em `.connections/instagram_ids.json`.

---

## 5. Publicar no feed

**Facebook** — aceita upload binário direto (multipart), não depende de a
imagem estar hospedada em algum lugar público:

```
POST https://graph.facebook.com/v21.0/{PAGE_ID}/photos
Content-Type: multipart/form-data
  source={binário da imagem}
  caption={legenda}
  access_token={PAGE_ACCESS_TOKEN}
```

No n8n: node **Convert to File** pra transformar o `feedImageBase64` que vem
do `/post-generator/generate` em binário, depois **HTTP Request** com esse
binário no campo `source`.

**Instagram** — só aceita `image_url` público, não tem upload binário. Fluxo
em 2 chamadas:

```
POST https://graph.facebook.com/v21.0/{IG_USER_ID}/media
  image_url={URL_PUBLICA_DA_IMAGEM}
  &caption={legenda}
  &access_token={PAGE_ACCESS_TOKEN}
→ { "id": "{CREATION_ID}" }

POST https://graph.facebook.com/v21.0/{IG_USER_ID}/media_publish
  creation_id={CREATION_ID}
  &access_token={PAGE_ACCESS_TOKEN}
```

> **Pendente:** o `/post-generator/generate` do backend devolve a imagem em
> base64, não uma URL pública. O node do Instagram (feed e story) só
> funciona depois de decidir onde hospedar a imagem publicamente
> (Cloudinary, Vercel Blob, S3...). O Facebook não depende disso.

---

## 6. Publicar no story

Mesma conta, mesmo token, mesma permissão (`instagram_content_publish` já
cobre feed, story e reels — não precisa pedir nada a mais). A diferença é um
parâmetro na criação do container:

```
POST https://graph.facebook.com/v21.0/{IG_USER_ID}/media
  image_url={URL_PUBLICA_DA_IMAGEM_STORY}
  &media_type=STORIES
  &access_token={PAGE_ACCESS_TOKEN}
→ { "id": "{CREATION_ID}" }

POST https://graph.facebook.com/v21.0/{IG_USER_ID}/media_publish
  creation_id={CREATION_ID}
  &access_token={PAGE_ACCESS_TOKEN}
```

Pontos de atenção específicos de story:

- **Sem `caption`** — a API de story não aceita legenda/texto sobreposto.
  Isso não é problema pro TrabalhaRN porque o `storyImageBase64` já vem com
  o texto desenhado na própria arte (o gerador do backend renderiza tudo via
  canvas antes de mandar).
- Vale só pra imagem estática por enquanto. Se um dia quiser postar vídeo
  no story, o parâmetro muda pra `video_url` e entram limites de duração/
  tamanho — fora de escopo aqui.
- O Facebook (página) **não tem** um equivalente direto de "story" via essa
  mesma API de forma simples — publicar story na página do Facebook usa um
  endpoint separado (`/{PAGE_ID}/photo_stories` ou `/video_stories`,
  ainda mais limitado). Se o objetivo é só Instagram Story, o fluxo acima já
  resolve; se quiser também Facebook Story, avisa que a gente detalha à
  parte.

**Resposta à pergunta "isso que temos é suficiente pra story":** sim, o
token e as permissões do passo 1-3 já cobrem story sem precisar de nada
extra — falta só o mesmo ponto pendente do feed (URL pública da imagem).

---

## 7. Renovação do token grande

Na prática, o `PAGE_ACCESS_TOKEN` do passo 3 **não expira por tempo** — só
invalida se: você trocar a senha do Facebook, revogar o app manualmente, ou
remover a página das contas que você administra. Não existe uma rotina de
renovação automática porque a geração do token de usuário (passo 1) exige
login interativo no navegador — não dá pra automatizar sem esse passo humano.

Prática recomendada:

1. Um workflow no n8n (1x por semana, por exemplo) chama
   `GET /me?access_token={PAGE_ACCESS_TOKEN}` e avisa (email/Slack) se der
   erro de token inválido — assim você percebe antes da automação simplesmente
   parar de postar.
2. Se o token invalidar (ou por precaução, a cada ~50 dias), repita os passos
   1 → 2 → 3 deste documento do zero: gera token de usuário novo no Graph
   API Explorer, troca pelo de longa duração, pega o novo Page Access Token,
   atualiza a credencial no n8n.
3. Não precisa refazer o passo 4 (ID do Instagram) — esse ID não muda
   enquanto a conta continuar vinculada à mesma página.
