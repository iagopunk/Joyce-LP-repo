# Cartão de visita da Joyce — feedback dela (registrado em 13/09/2026)

Ler isto ANTES de mexer no cartão. O cartão vive como artifact, não neste repo:

- **Cartao Joyce Cruvinel com foto** (versão mais recente, 12/09) — https://claude.ai/code/artifact/495c3417-14fe-476e-8c48-6db23119232c
- Cartao de Visita Joyce Cruvinel (versão anterior, 29/08) — https://claude.ai/code/artifact/0774e9dd-762e-42ed-85bb-5a6f67f250a1

## O que a Joyce pediu

**Foto**
- Só a foto da mão, ou sem foto nenhuma.
- Preferência dela: **sem foto**. No máximo algo bem pequeno num canto.

**Layout — aprovado**
- Gostou do **lado da logo** do cartão (a frente limpa, só a logo — opções A/B).
- Gostou do QR code embaixo, do mesmo lado, **igual às primeiras opções**. Não mudar isso.

## Resolvido

- **Serviço no cartão: só Rolfing** (confirmado pelo Iago em 30/10/2026; já era a decisão dela em 28/10: "bem clean, só Rolfing mesmo"). Sem Pilates, nutrição etc.
- **Nome:** "Leaside Rolfing" (com o bairro; ela fica em Leaside depois da mudança). O verso já traz essa linha.
- **Verso B (30/10):** os dois bonecos do diagrama de postura (marca d'água a 8% de opacidade) saíram de trás do texto e foram para trás do anel da logo, no lado direito. O anel fica na frente e tampa os bonecos (disco opaco na cor do cartão atrás dele); só o diagrama é transparente.

> Link canônico do cartão hoje: https://claude.ai/artifact/A4Qtm6x8spBv85G5j4VBsZ (mesmo artifact da versão "com foto", só que o título é antigo).

- **QR (07/11):** agora aponta para `https://joybyjoyce.com/#contact` (seção de contato, onde ficam o formulário e os contatos), não para a home. Combina com a frase "Scan to book a session". QR versão 3 (29x29 módulos, correção M). Lê em simulação de impressão (borrada) a 18,5 mm (A) e a 15 mm (B). Se o domínio mudar, o redirecionamento do antigo precisa ficar pra sempre e preservar o `#contact`. O site não tem analytics, então não dá para medir escaneamentos; um `?utm_source=` deixaria o QR mais denso.

## Pendente com ela

- Nada por enquanto.

> As anotações de feedback que ficavam dentro do artifact foram tiradas em 06/11/2026
> (poluíam o canvas que a Joyce usa para aprovar o cartão). O histórico completo está
> abaixo, na seção "Histórico".

## Estado do cartão (06/11/2026)

- Opções **A e B** são as atuais (frente e verso), com o texto em 7 pt (10 px no canvas).
- **Verso A (07/11):** layout em 2 colunas que se dividem no meio do cartão. Esquerda: nome, linha amarela horizontal e contatos. Direita: anel em cima e QR (74 px, ~18,5 mm, mesma largura do anel) embaixo, com "Scan to book a session". Sem linha vertical dourada. Motivo: o QR de 9,5 mm era pequeno demais para imprimir (a simulação falhava com impressão borrada). O verso B tem QR de 15 mm.
- Opções **C e D** estão descartadas: dados antigos (sem endereço novo e sem Leaside Rolfing), e a C tem foto.
- O artifact fica limpo, só com as opções para a Joyce escolher. Não recolocar anotações lá; registrar aqui.

## Histórico — anotações que estavam no artifact (copiadas em 06/11/2026)

```
FEEDBACK DA JOYCE - 28/10 (aplicado nas opcoes A e B)
Endereco novo (muda 01/11): 872 Millwood Rd #56, Toronto, ON M4G 1W9 (Leaside).
So Rolfing no cartao, sem Pilates (decisao explicita dela: "bem clean, so Rolfing mesmo").
Frente: trocou "Rolfing Structural Integration . Toronto" por @joycecruvinel . joybyjoyce.com.
Verso: tirou a foto. Sem painel colorido: so o anel da logo pequeno (o "logo pequenininho" que ela pediu), com o glow suave da frente e uma linha fina separando. Acrescentou linha "Leaside Rolfing" (nome que ela vai usar no Google Meu Negocio).
30/10: texto do cartao subiu para 7 pt (10px no canvas) nas opcoes A e B; so Rolfing confirmado.
C e D ficaram com os dados antigos (sem endereco novo e sem Leaside Rolfing; a C tem foto) e foram movidas para "Versoes descartadas", la embaixo.

FEEDBACK DA JOYCE — 13/09
Foto: so a da mao, ou sem foto nenhuma. Ela prefere SEM foto; no maximo alguma coisa bem pequenininha num canto.
Aprovado: o lado da logo e o QR code embaixo, do mesmo lado, igual nas primeiras opcoes. Manter assim.
Pendente: ela ainda vai falar quais trabalhos entram no cartao (pilates, nutricao, etc.).
```

(O "Pendente" de 13/09 foi resolvido: só Rolfing, ver "Resolvido" acima.)

## Contexto do site (registrado em 06/11/2026)

- O site joybyjoyce.com está na **Netlify** (projeto "joybyjoycetemporary", deploy automático do GitHub). Merge na `main` publica.
- O GitHub Pages deste repo publica a branch `preview` e não é o site de produção.
- `styles.css` e `main.js` são carregados com `?v=AAAAMMDD` no `index.html`. Ao mudar CSS ou JS, atualizar esse número, senão visitantes recorrentes veem o HTML novo com CSS antigo em cache.
