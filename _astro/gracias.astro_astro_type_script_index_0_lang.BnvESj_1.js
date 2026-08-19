import{g as y,t as h,c as E}from"./cart.CAQX5pWV.js";const l=y();if(l.itemCount>0){h("purchase",{currency:"GTQ",value:l.total}),E();const a=document.getElementById("cart-count");a&&(a.textContent="0")}const c=document.getElementById("gracias-resumen"),u=new URLSearchParams(window.location.search).get("checkout_id");function o(a){return`Q${(a/100).toFixed(2)}`}function s(a){return String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}async function $(a){c.hidden=!1;const m=c.dataset.base??"",g=JSON.parse(c.dataset.miniaturas??"{}"),p=document.getElementById("gracias-cargando"),f=document.getElementById("gracias-cuerpo");let e;try{const t=await fetch(`${m}/api/tienda/pedido/${encodeURIComponent(a)}`);if(e=await t.json(),!t.ok||!e?.ok)throw new Error("sin resumen")}catch{c.hidden=!0;return}p.hidden=!0,f.hidden=!1;const i=document.getElementById("gracias-bajada");e.numero?i.innerHTML=`Ya lo tenemos anotado. Si hay duda de dirección o pago, lo ajustamos antes de enviar.<span class="gracias-numero">Pedido #${e.numero}</span>`:e.confirmando&&(i.textContent="Estamos confirmando el pago con el banco. Tu pedido ya quedó anotado.");const v=document.getElementById("gracias-lineas");v.innerHTML=e.lineas.map(t=>{const d=g[t.sku];return`<div class="gracias-linea">
          ${d?`<img src="${d}" alt="" width="56" height="56" loading="lazy" />`:'<span class="sinfoto" aria-hidden="true"></span>'}
          <div class="cuerpo">
            <p class="nombre">${s(t.nombre)}</p>
            <p class="cantidad">${t.cantidad} × ${o(t.precio_unitario_centavos)}</p>
          </div>
          <span class="monto">${o(t.precio_unitario_centavos*t.cantidad)}</span>
        </div>`}).join(""),document.getElementById("gracias-subtotal").textContent=o(e.subtotal_centavos),document.getElementById("gracias-envio").textContent=e.envio_centavos>0?o(e.envio_centavos):"Gratis",document.getElementById("gracias-total").textContent=o(e.total_centavos);const r=document.getElementById("gracias-entrega"),n=e.entrega;if(n){const t=[n.direccion,n.municipio,n.departamento].filter(Boolean).join(", ");r.innerHTML=`
        <strong>${s(n.nombre)}</strong><br />
        ${s(t)}<br />
        ${s(n.telefono)}
        ${n.nota?`<p class="nota">${s(n.nota)}</p>`:""}
      `}else r.parentElement?.querySelectorAll(".gracias-titulo")[1]?.remove(),r.remove()}u&&$(u);
