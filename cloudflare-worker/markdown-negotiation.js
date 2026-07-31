/**
 * Cloudflare Worker — Markdown negotiation for alexandre.siqueira.me
 *
 * When a request sends `Accept: text/markdown`, converts the origin's
 * already-rendered HTML (the <main> content Jekyll builds) into Markdown
 * on the fly, instead of maintaining separate .md files that could drift
 * from the HTML — the same one-source-of-truth reasoning behind
 * _includes/pub-card.html in the Jekyll site itself.
 *
 * Any request without an Accept: text/markdown header, or any error
 * during conversion, falls through to the unmodified origin response.
 * Normal browser traffic is never touched.
 *
 * Deploy: bind this Worker to a Route on the zone (start narrow, e.g.
 * alexandre.siqueira.me/, and widen to alexandre.siqueira.me/* once
 * verified). Test locally with `wrangler dev` before binding any route,
 * then validate against production with:
 *   curl -H "Accept: text/markdown" https://alexandre.siqueira.me/
 */

export default {
  async fetch(request) {
    const accept = request.headers.get('Accept') || '';
    const wantsMarkdown = accept.includes('text/markdown');

    const originResponse = await fetch(request);
    if (!wantsMarkdown) return originResponse;

    const contentType = originResponse.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return originResponse;

    try {
      const markdown = await htmlToMarkdown(originResponse.clone());
      return new Response(markdown, {
        status: originResponse.status,
        headers: {
          'content-type': 'text/markdown; charset=utf-8',
          'cache-control': originResponse.headers.get('cache-control') || 'public, max-age=3600',
          vary: 'Accept',
        },
      });
    } catch (err) {
      return originResponse;
    }
  },
};

async function htmlToMarkdown(response) {
  let title = '';
  const out = [];
  let skipDepth = 0;

  const skip = {
    element(el) {
      skipDepth++;
      el.onEndTag(() => { skipDepth--; });
    },
  };

  const write = (text) => {
    if (skipDepth === 0) out.push(text);
  };

  const heading = (level) => ({
    element(el) {
      write('\n' + '#'.repeat(level) + ' ');
      el.onEndTag(() => write('\n'));
    },
  });

  const wrap = (marker) => ({
    element(el) {
      write(marker);
      el.onEndTag(() => write(marker));
    },
  });

  const rewriter = new HTMLRewriter()
    .on('title', { text: (t) => { title += t.text; } })
    // UI chrome and non-content elements inside <main> — excluded from the
    // markdown mirror on purpose (filter buttons, tab controls, icon SVGs).
    .on('main svg', skip)
    .on('main script', skip)
    .on('main style', skip)
    .on('main button', skip)
    .on('main nav', skip)
    .on('main h1', heading(1))
    .on('main h2', heading(2))
    .on('main h3', heading(3))
    .on('main h4', heading(4))
    .on('main p', {
      element(el) {
        write('\n');
        el.onEndTag(() => write('\n'));
      },
    })
    .on('main blockquote', {
      element(el) {
        write('\n> ');
        el.onEndTag(() => write('\n'));
      },
    })
    .on('main li', {
      element(el) { write('\n- '); },
    })
    .on('main strong', wrap('**'))
    .on('main b', wrap('**'))
    .on('main em', wrap('_'))
    .on('main i', wrap('_'))
    .on('main a', {
      element(el) {
        const href = el.getAttribute('href') || '';
        write('[');
        el.onEndTag(() => write(`](${href})`));
      },
    })
    .on('main img', {
      element(el) {
        const alt = el.getAttribute('alt') || '';
        const src = el.getAttribute('src') || '';
        write(`\n![${alt}](${src})\n`);
      },
    })
    .on('main *', { text: (t) => write(t.text) });

  await rewriter.transform(response).text();

  const body = out.join('')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return `# ${title.trim()}\n\n${body}\n`;
}
