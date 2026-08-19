import{b as r,u as m,r as E,g as p,t as f,c as v}from"./cart.CAQX5pWV.js";const $="50231015202",x={whatsapp:$},u=document.getElementById("pedido-items"),C=document.getElementById("pedido-subtotal"),k=document.getElementById("pedido-shipping"),q=document.getElementById("pedido-total"),g=document.getElementById("pedido-form"),s=document.getElementById("pedido-pay");function l(a){return`Q${a}`}function h(){const a=r(),n=p(),e=document.getElementById("cart-count");e&&(e.textContent=String(n.itemCount)),a.items.length===0?u.innerHTML='<p class="text-niebla">Todavía no hay nada sobre la mesa. <a class="underline" href="/productos/">Ir al mostrador</a>.</p>':u.innerHTML=a.items.map(t=>`
            <div class="pedido-linea">
              <div>
                <p class="font-semibold">${t.name}</p>
                <p class="text-sm text-niebla">${t.unitLabel}</p>
                <div class="cajon-qty">
                  <button data-slug="${t.slug}" data-action="dec" aria-label="Restar">−</button>
                  <span>${t.quantity}</span>
                  <button data-slug="${t.slug}" data-action="inc" aria-label="Sumar">+</button>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold">Q${t.price*t.quantity}</p>
                <button data-slug="${t.slug}" data-action="remove" class="mt-1 text-xs underline">Quitar</button>
              </div>
            </div>
          `).join(""),C.textContent=l(n.subtotal),k.textContent=n.isFreeShipping?"Gratis":l(n.shipping),q.textContent=l(n.total)}u.addEventListener("click",a=>{const n=a.target.closest("button[data-slug]");if(!n)return;const e=n.getAttribute("data-slug"),t=n.getAttribute("data-action"),o=r().items.find(d=>d.slug===e);o&&(t==="inc"?m(e,o.quantity+1):t==="dec"?m(e,o.quantity-1):t==="remove"&&E(e),h())});document.querySelectorAll("[data-pago]").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.pago;document.querySelectorAll("[data-pago]").forEach(e=>{e.classList.toggle("is-on",e===a),e.setAttribute("aria-selected",e===a?"true":"false")}),document.querySelectorAll("[data-panel]").forEach(e=>{e.hidden=e.dataset.panel!==n})})});g.addEventListener("submit",a=>{a.preventDefault();const n=r(),e=p();if(n.items.length===0)return;const t=new FormData(g),o=n.items.map(i=>`${i.name} x ${i.quantity} — Q${i.price*i.quantity}`).join(`
`),d=`CONTRA ENTREGA
${t.get("nombre")}
${t.get("telefono")}
${t.get("direccion")}
${t.get("ciudad")}
${t.get("nota")||""}

${o}
Total: Q${e.total}`;f("begin_checkout",{currency:"GTQ",value:e.total,payment_type:"cod"}),v();const b=`https://wa.me/${x.whatsapp}?text=${encodeURIComponent(d)}`;window.location.href=b});const c=document.getElementById("pedido-error"),I=document.getElementById("pedido-card"),T=I?.dataset.caja??"";function y(a){c&&(c.textContent=a,c.hidden=!1)}s?.addEventListener("click",async()=>{const a=r();if(a.items.length===0)return;c&&(c.hidden=!0),s.disabled=!0;const n=s.textContent;s.textContent="Abriendo la caja…";try{const e=await fetch(T,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:a.items.map(o=>({sku:o.sku,cantidad:o.quantity}))})}),t=await e.json();if(!e.ok||!t?.checkout_url){y(t?.error??"No se pudo abrir el pago. Probá de nuevo.");return}f("begin_checkout",{currency:"GTQ",value:p().total,payment_type:"card"}),window.location.href=t.checkout_url}catch{y("Se cayó la conexión. Probá de nuevo o pedinos por WhatsApp.")}finally{s.disabled=!1,s.textContent=n}});h();
