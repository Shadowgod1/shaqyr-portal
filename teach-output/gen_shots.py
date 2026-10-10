# Generates shots.json for lesson 01 with today's date (fixtures need ISO times for "today").
import json, datetime, sys
today = datetime.datetime.now(datetime.timezone.utc).date()
def at(h, m=0): return datetime.datetime(today.year, today.month, today.day, h, m, tzinfo=datetime.timezone.utc).isoformat().replace('+00:00', 'Z')
docs = [
 {"id":"d1","clinicId":"c1","capacity":1,"specialization":"косметолог","profile":{"fullName":"Динара Сапарова"}},
 {"id":"d2","clinicId":"c1","capacity":1,"specialization":"дерматолог","profile":{"fullName":"Алия Мухамедова"}},
 {"id":"d3","clinicId":"c1","capacity":1,"specialization":"массажист","profile":{"fullName":"Ержан Касымов"}},
]
svc = {
 "bio":{"id":"s2","name":"Биоревитализация","durationMinutes":45},
 "clean":{"id":"s1","name":"Чистка лица комбинированная","durationMinutes":60},
 "peel":{"id":"s5","name":"Пилинг PRX-T33","durationMinutes":40},
 "botox":{"id":"s3","name":"Ботулинотерапия (зона лба)","durationMinutes":30},
 "mass":{"id":"s4","name":"Массаж лица буккальный","durationMinutes":60},
 "cons":{"id":"s6","name":"Консультация косметолога","durationMinutes":30},
}
def ap(i, d, h, m, eh, em, st, s, name, **x):
  return {"id":i,"doctorId":docs[d]["id"],"doctor":docs[d],"status":st,"version":3,"startTime":at(h,m),"endTime":at(eh,em),
          "patient":{"id":"p-"+i,"fullName":name},"service":svc[s],"isPaid":st=="COMPLETED",**x}
appts = [
 ap("a1",0,14,0,15,0,"COMPLETED","clean","Мадина Ахметова"),
 ap("a2",0,16,0,16,45,"COMPLETED","bio","Сауле Жумабаева"),
 ap("a3",0,20,30,21,15,"CONFIRMED","bio","Айгерим Нурланова"),
 ap("a4",1,15,0,15,30,"COMPLETED","cons","Дана Исмаилова"),
 ap("a5",1,18,0,18,30,"COMPLETED","botox","Камила Серикова"),
 ap("a6",1,21,0,21,40,"SCHEDULED","peel","Асель Тулегенова"),
 ap("a7",2,17,0,18,0,"COMPLETED","mass","Жанна Омарова"),
 ap("a8",2,19,30,20,30,"CONFIRMED","mass","Гульнара Абенова"),
]
wh = {k:"09:00-22:00" for k in ["mon","tue","wed","thu","fri","sat","sun"]}
schedule = {"doctors":docs,"rooms":[],"appointments":appts,"expectedLeads":[],"workingHours":wh}
arrived = json.loads(json.dumps(schedule))
for a in arrived["appointments"]:
  if a["id"]=="a3": a["status"]="ARRIVED"; a["version"]=4
flags = ['portal.v2.shell','portal.v2.density','portal.v2.primitives','workflow.core','workflow.myWork','workflow.approvals','customer.subject',
 'communications.v2','schedule.v2','clinical.execution','commercial.offer','finance.ledger','supply.v2','documents.v2','network.v2','adminCenter.v2','people.v2','marketing.v2']
mods = ['schedule','finance','patients','medical','safety','analytics','staff','communications','waitlist','ownerAnalytics','sales','bonuses','leads','inventory','promotions','services','documents','settings','integrations','billing','assistant']
user = {"id":"u-admin","fullName":"Жанар Бекова","role":"OWNER","clinicId":"c1","clinicName":"Sulu Aesthetic",
  "effectiveRole":{"id":"OWNER","type":"system","label":"Владелец","workspace":"owner","permissions":{m:["view","create","edit","delete"] for m in mods}},
  "capabilities":{"canViewMyWork":True,"canManageWork":True},"portalRollout":{f:True for f in flags},
  "workflowWorkspace":{"roleKey":"OW","home":"/admin/workspace/owner","scope":"clinic","views":["my","team","handoffs","approvals","escalations"]},
  "entitlements":{"aiAssistant":True,"procedureSafety":True,"aiCrossNetwork":True}}
B = "http://127.0.0.1:4174"
login = f"localStorage.setItem('sulu_token','demo-token');localStorage.setItem('sulu_user',{json.dumps(json.dumps(user,ensure_ascii=False),ensure_ascii=False)});localStorage.setItem('sulu-day-layout','columns');"
flip = "(()=>{const A=%s;const f=window.fetch;window.fetch=(u,o)=>String(u).includes('/api/admin/schedule')?Promise.resolve(new Response(JSON.stringify(A),{status:200,headers:{'Content-Type':'application/json'}})):f(u,o)})()" % json.dumps(arrived, ensure_ascii=False)
mode = sys.argv[1] if len(sys.argv)>1 else 'probe'
steps = [{"goto":"/login"},{"eval":login},{"goto":"/admin/schedule"},{"wait":2500}]
if mode == 'probe':
  steps += [{"shot":"probe"}]
else:
  card = ".sv2-appt[data-appointment-id='a3']"
  steps += [
    {"shot":"board","boxes":{"card":card,"stat":"text=Пришли >> xpath=..","now":".sv2-board"}},
    {"click":card},{"waitFor":"[role=menu]"},{"wait":400},
    {"shot":"menu","boxes":{"card":card,"menu":"[role=menu]","arrived":"[role=menu] [role=menuitem]:has-text('Пришёл')"}},
    {"eval":flip},
    {"click":"[role=menu] [role=menuitem]:has-text('Пришёл')"},{"wait":1500},
    {"shot":"arrived","boxes":{"card":card,"stat":"text=Пришли >> xpath=..","toast":"[data-sonner-toast]"}},
  ]
sc = {"baseUrl":B,"viewport":{"w":1440,"h":810},"scale":2,"steps":steps,"routes":{
  B+"/api/**":{"status":404,"json":{"ok":False,"error":{"code":"NOT_FOUND","message":"Нет данных"}}},
  B+"/socket.io/**":{"status":404,"body":""},
  B+"/api/auth/me":{"json":user},
  B+"/api/admin/schedule**":{"json":schedule},
  B+"/api/admin/appointments/a3/transitions":{"json":{"ok":True,"appointment":{"id":"a3","status":"ARRIVED","version":4}}},
  B+"/api/appointments/a3/status":{"json":{"ok":True}},
}}
out = sys.argv[2] if len(sys.argv)>2 else '01-otmechaem-prihod/shots.json'
json.dump(sc, open(out,'w'), ensure_ascii=False, indent=1)
