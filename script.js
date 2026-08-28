let db = null;
let students = [];
let dates = [];
let attendance = [];

const pages = {
  presencas:{title:"Presenças",render:renderPresencas},
  provas:{title:"Provas",render:renderProvas},
  atividades:{title:"Atividades",render:renderAtividades},
  agenda:{title:"Agenda",render:renderAgenda},
  notas:{title:"Notas",render:renderNotas}
};

const content=document.getElementById("appContent");
const title=document.getElementById("pageTitle");

document.querySelectorAll(".nav-item").forEach(btn=>btn.onclick=()=>navigate(btn.dataset.page));

function navigate(page){
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  title.textContent=pages[page].title;
  pages[page].render();
}

async function carregarBanco(){
  try{
    const response=await fetch("data/banco.json");
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    db=await response.json();
    students=db.alunos || [];
    dates=db.datas_presenca || [];
    const presencasBase=db.presencas || [];

    const salvo=localStorage.getItem("seedfAttendance");
    attendance=salvo ? JSON.parse(salvo) : presencasBase.map(linha=>[...linha]);

    if(!Array.isArray(attendance) || attendance.length!==students.length){
      attendance=presencasBase.map(linha=>[...linha]);
    }

    navigate("presencas");
  }catch(error){
    console.error("Não foi possível carregar o banco JSON:",error);
    content.innerHTML=`<div class="page"><div class="card"><h2>Erro ao carregar os dados</h2><p style="color:#8992a3">Não foi possível abrir <strong>data/banco.json</strong>. Se você estiver abrindo o index.html diretamente pelo computador, use o GitHub Pages ou um servidor local.</p></div></div>`;
  }
}

function renderPresencas(){
 const total=attendance.flat().length;
 const present=attendance.flat().filter(Boolean).length;
 const rate=total ? Math.round(present/total*100) : 0;

 content.innerHTML=`<div class="page">
 <div class="grid-cards">
   <div class="card stat"><small>Alunos</small><strong>${students.length}</strong></div>
   <div class="card stat"><small>Presenças registradas</small><strong class="ok">${present}</strong></div>
   <div class="card stat"><small>Faltas registradas</small><strong class="warn">${total-present}</strong></div>
   <div class="card stat"><small>Frequência média</small><strong class="ok">${rate}%</strong></div>
 </div>
 <div class="card">
   <div class="toolbar">
     <div><h2 style="margin:0 0 5px">Controle de frequência</h2><span style="color:#8992a3;font-size:13px">Clique nos círculos para alternar presença e falta.</span></div>
     <div class="field"><label>Turma</label><select><option>3º A — Informática</option><option>3º B — Informática</option></select></div>
   </div>
   <div class="attendance-wrap"><table class="attendance"><thead><tr><th>ALUNO</th>${dates.map(d=>`<th>${d}</th>`).join("")}</tr></thead>
   <tbody>${students.map((s,i)=>`<tr><td class="student">${s.nome}</td>${dates.map((_,j)=>`<td><button class="check ${attendance[i][j]?'present':'absent'}" data-i="${i}" data-j="${j}">${attendance[i][j]?'✓':'×'}</button></td>`).join("")}</tr>`).join("")}</tbody></table></div>
   <div class="legend"><span><i class="dot green"></i>Presente</span><span><i class="dot red"></i>Falta</span></div>
 </div></div>`;

 document.querySelectorAll(".check").forEach(b=>b.onclick=()=>{
   const i=+b.dataset.i,j=+b.dataset.j;
   attendance[i][j]=!attendance[i][j];
   localStorage.setItem("seedfAttendance",JSON.stringify(attendance));
   renderPresencas();
   showToast("Frequência atualizada");
 });
}

function renderList(heading,items){
 content.innerHTML=`<div class="page"><div class="card"><h2 style="margin-top:0">${heading}</h2><div class="list">${items.map(x=>`<div class="list-item"><div><strong>${x[0]}</strong><div style="color:#8992a3;font-size:13px;margin-top:5px">${x[1]}</div></div><span class="badge">${x[2]}</span></div>`).join("")}</div></div></div>`;
}

function renderProvas(){
 renderList("Próximas provas",(db.provas||[]).map(x=>[x.titulo,x.data,x.descricao]));
}

function renderAtividades(){
 renderList("Atividades da turma",(db.atividades||[]).map(x=>[x.titulo,x.data,x.status]));
}

function renderAgenda(){
 renderList("Agenda acadêmica",(db.agenda||[]).map(x=>[x.titulo,x.data,x.local]));
}

function renderNotas(){
 const notas=Object.fromEntries((db.notas||[]).map(n=>[n.aluno_id,n.media]));
 content.innerHTML=`<div class="page"><div class="card"><h2 style="margin-top:0">Notas dos alunos</h2><div class="list">${students.map(s=>`<div class="list-item"><div><strong>${s.nome}</strong><div style="color:#8992a3;font-size:13px;margin-top:5px">Média do bimestre</div></div><span class="badge">${Number(notas[s.id] ?? 0).toFixed(1)}</span></div>`).join("")}</div></div></div>`;
}

function showToast(msg){
 const t=document.getElementById("toast");
 t.textContent=msg;
 t.classList.add("show");
 setTimeout(()=>t.classList.remove("show"),1800);
}

document.getElementById("themeBtn").onclick=()=>{
 document.body.classList.toggle("dark");
 document.getElementById("themeBtn").textContent=document.body.classList.contains("dark")?"☀ Modo claro":"☾ Modo escuro";
};

document.getElementById("logoutBtn").onclick=()=>showToast("Protótipo: saída simulada");

carregarBanco();
