const feed = document.querySelector('#feed');
const empty = document.querySelector('#empty');
const counter = document.querySelector('#counter');
const template = document.querySelector('#card-template');
const dialog = document.querySelector('#post-dialog');
const dialogContent = document.querySelector('#dialog-content');

const fmtDate = (value) => {
  if (!value) return '';
  const [y,m,d] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('es-AR', { day:'numeric', month:'long' }).format(new Date(y,m-1,d));
};

const safe = (value='') => String(value)
  .replaceAll('&','&amp;')
  .replaceAll('<','&lt;')
  .replaceAll('>','&gt;')
  .replaceAll('"','&quot;')
  .replaceAll("'",'&#039;');

function isFlyer(post){
  return post.kind === 'flyer' && Boolean(post.title || post.date || post.time || post.place);
}

function setImage(img, fallback, post){
  if (post.image) {
    img.src = post.image;
    img.alt = post.title ? `Flyer: ${post.title}` : 'Flyer institucional';
    img.addEventListener('error', () => {
      img.hidden = true;
      fallback.hidden = false;
    }, { once:true });
  } else {
    img.hidden = true;
    fallback.hidden = false;
  }

  fallback.querySelector('.fallback-date').textContent = [fmtDate(post.date), post.time].filter(Boolean).join(' · ');
  fallback.querySelector('.fallback-title').textContent = post.title || 'Actividad FCPyS';
  fallback.querySelector('.fallback-place').textContent = post.place ? `⌖ ${post.place}` : '';
}

function openPost(post){
  const media = post.image
    ? `<img src="${safe(post.image)}" alt="Flyer: ${safe(post.title || 'Actividad FCPyS')}" onerror="this.closest('.detail-media').innerHTML='<div class=\'detail-fallback\'><span class=\'date\'>${safe([fmtDate(post.date), post.time].filter(Boolean).join(' · '))}</span><h2>${safe(post.title || 'Actividad FCPyS')}</h2><span class=\'place\'>${safe(post.place ? `⌖ ${post.place}` : '')}</span></div>'">`
    : `<div class="detail-fallback"><span class="date">${safe([fmtDate(post.date), post.time].filter(Boolean).join(' · '))}</span><h2>${safe(post.title || 'Actividad FCPyS')}</h2><span class="place">${safe(post.place ? `⌖ ${post.place}` : '')}</span></div>`;

  const mapHref = post.map_url || '#';
  const instagramHref = post.instagram_url || '#';

  dialogContent.innerHTML = `
    <article class="detail">
      <div class="detail-media">${media}</div>
      <div class="detail-info">
        <span class="kicker">ACTIVIDAD FCPyS</span>
        <h2>${safe(post.title || 'Actividad')}</h2>
        <div class="meta-list">
          ${post.date ? `<div class="meta-row"><span>Fecha</span><strong>${safe(fmtDate(post.date))}</strong></div>` : ''}
          ${post.time ? `<div class="meta-row"><span>Hora</span><strong>${safe(post.time)}</strong></div>` : ''}
          ${post.place ? `<div class="meta-row"><span>Lugar</span><strong>${safe(post.place)}</strong></div>` : ''}
        </div>
        <div class="actions">
          ${post.place ? `<a class="action primary" href="${safe(mapHref)}">⌖ CÓMO LLEGAR</a>` : ''}
          ${post.instagram_url ? `<a class="action secondary" target="_blank" rel="noopener" href="${safe(instagramHref)}">VER EN INSTAGRAM</a>` : ''}
        </div>
        <p class="source-note">Los datos de esta tarjeta se extraerán automáticamente del flyer/publicación. Las fotos sin información de actividad no se muestran en este feed.</p>
      </div>
    </article>`;

  dialog.showModal();
}

function render(posts){
  const lastTen = posts.slice(0, 10);
  const flyers = lastTen.filter(isFlyer);
  feed.innerHTML = '';
  counter.textContent = `${flyers.length} flyers de ${lastTen.length} posts`;
  empty.hidden = flyers.length > 0;

  flyers.forEach((post) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector('.post-card');
    const img = node.querySelector('img');
    const fallback = node.querySelector('.fallback-poster');
    node.querySelector('h3').textContent = post.title || 'Actividad';
    node.querySelector('.meta').textContent = [fmtDate(post.date), post.time, post.place].filter(Boolean).join(' · ');
    setImage(img, fallback, post);
    card.addEventListener('click', () => openPost(post));
    card.addEventListener('keydown', (event) => {
      if(event.key === 'Enter' || event.key === ' '){
        event.preventDefault();
        openPost(post);
      }
    });
    feed.appendChild(node);
  });
}

document.querySelector('[data-close]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if(event.target === dialog) dialog.close();
});

fetch('./data/posts.json', { cache:'no-store' })
  .then((r) => {
    if(!r.ok) throw new Error('No se pudo cargar posts.json');
    return r.json();
  })
  .then(render)
  .catch((error) => {
    console.error(error);
    counter.textContent = 'Error de carga';
    empty.hidden = false;
  });
