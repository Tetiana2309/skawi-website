import { useEffect, useRef } from 'react';
import './Enrollment.css';

const copy = {
 UA: ['Як почати навчання','«Від першого звернення до першого уроку.»',[
 ['Консультація','Надішли заявку або зателефонуй','Познайомимося, дізнаємося про твою мету та визначимо рівень польської.'],
 ['Демонстрація','Оберемо твій\nплан навчання','Разом підберемо зручний графік, темп і програму відповідно до твоїх цілей.'],
 ['Оформлення','Погоджуємо\nплан навчання','Підписуємо договір і погоджуємо дату початку та організацію занять.'],
 ['Початок навчання','Розпочни\nнавчання з нами','Відвідай пробне заняття безкоштовно та познайомся з викладачем.']]],
 RU: ['Как начать обучение','«От первого обращения до первого урока.»',[
 ['Консультация','Отправь заявку или позвони','Познакомимся, узнаем о твоей цели и определим уровень польского.'],
 ['Демонстрация','Выберем твой\nплан обучения','Вместе подберём удобный график, темп и программу с учётом твоих целей.'],
 ['Оформление','Согласуем\nплан обучения','Подпишем договор и согласуем дату начала и организацию занятий.'],
 ['Начало обучения','Начни\nобучение с нами','Посети бесплатное пробное занятие и познакомься с преподавателем.']]],
 EN: ['How to start learning','“From the first inquiry to the first lesson.”',[
 ['Consultation','Send an inquiry or give us a call','We’ll get to know you, learn your goal and assess your Polish level.'],
 ['Demonstration','Choose your\nlearning plan','Together we’ll choose a schedule, pace and programme that fit your goals.'],
 ['Registration','Agree on your\nlearning plan','We’ll sign the agreement and arrange your start date and classes.'],
 ['Start learning','Start learning\nwith us','Attend a free trial lesson and meet your teacher.']]],
 PL: ['Jak zacząć naukę','„Od pierwszego kontaktu do pierwszej lekcji.”',[
 ['Konsultacja','Wyślij zgłoszenie lub zadzwoń','Poznamy się, dowiemy się o Twoim celu i określimy poziom polskiego.'],
 ['Demonstracja','Wybierzemy Twój\nplan nauki','Wspólnie dobierzemy harmonogram, tempo i program do Twoich celów.'],
 ['Formalności','Uzgodnimy\nplan nauki','Podpiszemy umowę i ustalimy datę rozpoczęcia oraz organizację zajęć.'],
 ['Początek nauki','Rozpocznij\nnaukę z nami','Weź udział w bezpłatnej lekcji próbnej i poznaj nauczyciela.']]],
 SP: ['Cómo empezar a estudiar','«Desde el primer contacto hasta la primera clase.»',[
 ['Consulta','Envía una solicitud o llámanos','Nos conoceremos, hablaremos de tu objetivo y evaluaremos tu nivel de polaco.'],
 ['Demostración','Elegiremos tu\nplan de estudios','Elegiremos juntos el horario, el ritmo y el programa según tus objetivos.'],
 ['Inscripción','Acordaremos tu\nplan de estudios','Firmaremos el contrato y acordaremos la fecha de inicio y las clases.'],
 ['Inicio de clases','Empieza a estudiar\ncon nosotros','Asiste a una clase de prueba gratuita y conoce a tu profesor.']]],
};
export default function Enrollment({language='UA'}){
 const [title,quote,steps]=copy[language]??copy.UA;
 const root=useRef(null);
 useEffect(()=>{
  const section=root.current;
  const grid=section?.querySelector('.enrollment__grid');
  if(!grid)return;
  const cards=[...grid.querySelectorAll('.enrollment__card')];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=window.matchMedia('(max-width: 650px)');
  let raf=0,active=-1;
  const update=()=>{
   raf=0;
   if(reduced.matches){active=-1;cards.forEach(card=>card.classList.remove('is-accent'));return;}
   const rect=grid.getBoundingClientRect(),vh=window.innerHeight;
   let index=-1;
   if(rect.top<vh*.85&&rect.bottom>vh*.15){
    if(mobile.matches){
     const anchor=vh*.55;
     index=cards.reduce((best,card,i)=>Math.abs(card.getBoundingClientRect().top+card.offsetHeight/2-anchor)<Math.abs(cards[best].getBoundingClientRect().top+cards[best].offsetHeight/2-anchor)?i:best,0);
    }else{
     const travel=Math.max(1,rect.height+vh*.7);
     const progress=Math.min(.9999,Math.max(0,(vh*.85-rect.top)/travel));
     index=Math.floor(progress*cards.length);
    }
   }
   if(index===active)return;
   active=index;
   cards.forEach((card,i)=>card.classList.toggle('is-accent',i===index));
  };
  const request=()=>{if(!raf)raf=requestAnimationFrame(update);};
  window.addEventListener('scroll',request,{passive:true});
  window.addEventListener('resize',request,{passive:true});
  reduced.addEventListener('change',request);
  request();
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',request);window.removeEventListener('resize',request);reduced.removeEventListener('change',request);cards.forEach(card=>card.classList.remove('is-accent'));};
 },[]);
 return <section className="enrollment" id="enrollment" ref={root} aria-labelledby="enrollment-heading">
  <div className="enrollment__topline"><h2 id="enrollment-heading">{title}</h2><span>{quote}</span></div>
  <ol className="enrollment__grid">
   {steps.map(([name,heading,description],i)=><li className="enrollment__card" key={i} style={{'--step':i}}>
    <div className="enrollment__face"><div className="enrollment__card-head"><span>{String(i+1).padStart(2,'0')}</span><h3>{name}</h3></div>
    <div className="enrollment__line" aria-hidden="true"/>
    <div className="enrollment__content"><p className="enrollment__lead">{heading}</p><p className="enrollment__description">{description}</p></div></div>
    <div className="enrollment__face enrollment__face--accent" aria-hidden="true"><div className="enrollment__card-head"><span>{String(i+1).padStart(2,'0')}</span><h3>{name}</h3></div>
    <div className="enrollment__line" aria-hidden="true"/>
    <div className="enrollment__content"><p className="enrollment__lead">{heading}</p><p className="enrollment__description">{description}</p></div></div>
   </li>)}
  </ol>
 </section>;
}
