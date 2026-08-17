import{g as c,u,r as y,b as r,t as m,c as h,d as b}from"./cart.BIgFsZGY.js";const E="50231015202",$={whatsapp:E},d=document.getElementById("pedido-items"),v=document.getElementById("pedido-subtotal"),x=document.getElementById("pedido-shipping"),C=document.getElementById("pedido-total"),p=document.getElementById("pedido-form"),q=document.getElementById("pedido-pay");function l(a){return`Q${a}`}function g(){const a=c(),n=r(),t=document.getElementById("cart-count");t&&(t.textContent=String(n.itemCount)),a.items.length===0?d.innerHTML='<p class="text-niebla">Todavía no hay nada sobre la mesa. <a class="underline" href="/productos/">Ir al mostrador</a>.</p>':d.innerHTML=a.items.map(e=>`
            <div class="pedido-linea">
              <div>
                <p class="font-semibold">${e.name}</p>
                <p class="text-sm text-niebla">${e.unitLabel}</p>
                <div class="cajon-qty">
                  <button data-slug="${e.slug}" data-action="dec" aria-label="Restar">−</button>
                  <span>${e.quantity}</span>
                  <button data-slug="${e.slug}" data-action="inc" aria-label="Sumar">+</button>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold">Q${e.price*e.quantity}</p>
                <button data-slug="${e.slug}" data-action="remove" class="mt-1 text-xs underline">Quitar</button>
              </div>
            </div>
          `).join(""),v.textContent=l(n.subtotal),x.textContent=n.isFreeShipping?"Gratis":l(n.shipping),C.textContent=l(n.total)}d.addEventListener("click",a=>{const n=a.target.closest("button[data-slug]");if(!n)return;const t=n.getAttribute("data-slug"),e=n.getAttribute("data-action"),o=c().items.find(i=>i.slug===t);o&&(e==="inc"?u(t,o.quantity+1):e==="dec"?u(t,o.quantity-1):e==="remove"&&y(t),g())});document.querySelectorAll("[data-pago]").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.pago;document.querySelectorAll("[data-pago]").forEach(t=>{t.classList.toggle("is-on",t===a),t.setAttribute("aria-selected",t===a?"true":"false")}),document.querySelectorAll("[data-panel]").forEach(t=>{t.hidden=t.dataset.panel!==n})})});p.addEventListener("submit",a=>{a.preventDefault();const n=c(),t=r();if(n.items.length===0)return;const e=new FormData(p),o=n.items.map(s=>`${s.name} x ${s.quantity} — Q${s.price*s.quantity}`).join(`
`),i=`CONTRA ENTREGA
${e.get("nombre")}
${e.get("telefono")}
${e.get("direccion")}
${e.get("ciudad")}
${e.get("nota")||""}

${o}
Total: Q${t.total}`;m("begin_checkout",{currency:"GTQ",value:t.total,payment_type:"cod"}),h();const f=`https://wa.me/${$.whatsapp}?text=${encodeURIComponent(i)}`;window.location.href=f});q?.addEventListener("click",()=>{const a=c();if(a.items.length!==1)return;const n=a.items[0].slug,t=b.recurrente[n];t&&t.startsWith("http")&&(m("begin_checkout",{currency:"GTQ",value:r().total,payment_type:"card"}),window.location.href=t)});g();
