

var colorBackground = "#ffff00";                           
var colorVoltage = "#0000ff";                               
var colorAmperage = "#ff0000";                              
var colorScale = "#ffc800";                                 



var FONT = "normal normal bold 12px sans-serif";           
var FONT2 = "normal normal bold 16px monospace";           
var DEG = Math.PI/180;                                     
var DY = 4;                                                
var X_POT = 100;                                           
var W_POT = 200;                                           

// Attribute:

var canvas, ctx;                                           
var width, height;                                         
var ip1, ip2, ip3;                                         
var sl;                                                    
var slL, slR;                                              
var cb1, cb2;                                              

var drag;                                                                           
  
var u0;                                                    
var rv;                                                    
var rs;                                                    
var q;                                                     
var uv;                                                    



function getElement (id, text) {
  var e = document.getElementById(id);                     
  if (text) e.innerHTML = text;                            
  return e;                                                
  } 

// Start:

function start () {
  canvas = getElement("cv");                               
  width = canvas.width; height = canvas.height;            
  ctx = canvas.getContext("2d");                           
  getElement("ip1a",text01);                               
  ip1 = getElement("ip1b");                                
  getElement("ip1c",volt);                                 
  getElement("ip2a",text02);                               
  ip2 = getElement("ip2b");                                
  getElement("ip2c",ohm);                                  
  getElement("sla",text03);                                
  slL = getElement("slb");                                 
  sl = getElement("slc");                                  
  slR = getElement("sld");                                
  getElement("ip3a",text04);                              
  ip3 = getElement("ip3b");                               
  getElement("ip3c",ohm);                                    
  cb1 = getElement("cb1a");                               
  cb1.checked = false;                                    
  getElement("cb1b",text05);                               
  cb2 = getElement("cb2a");                                
  cb2.checked = false;                                     
  getElement("cb2b",text06);                               
  getElement("author",author);                             
  getElement("translator",translator);                     
  
  u0 = 5;                                                  
  rs = 100;
  q = 0.2;                                                 
  rv = 500;
  uv = voltageAppliance(q);                                
      
  updateInput();                                           
  paint();                                                 
  
  ip1.onkeydown = reactionEnter;
  ip2.onkeydown = reactionEnter;
  ip3.onkeydown = reactionEnter;
  cb1.onclick = paint;                                     
  cb2.onclick = paint;                                     
  sl.oninput = reactionSlider;
  sl.onchange = reactionSlider;                           
  slL.onclick = reactionSliderLeft;                        
  slR.onclick = reactionSliderRight;                       
  canvas.onmousedown = reactionMouseDown;                  
  canvas.ontouchstart = reactionTouchStart;                
  canvas.onmouseup = reactionMouseUp;                      
  canvas.ontouchend = reactionTouchEnd;                    
  canvas.onmousemove = reactionMouseMove;
  canvas.ontouchmove = reactionTouchMove;                      
  } 
  
function reactionSlider () {
  input(false);                                           
  }
  

  
function reactionSliderLeft () {
  sl.value = Math.max(Number(sl.value)-1,0);               
  input(false);                                            
  }

function reactionSliderRight () {
  sl.value = Math.min(Number(sl.value)+1,200);             
  input(false);                                            
  }
  

  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                                    
  }
  

  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           
  reactionDown(obj.clientX,obj.clientY);                   
  if (drag) e.preventDefault();                            
  }
  

  
function reactionMouseUp (e) {                                           
  reactionUp();                                            
  }
  

  
function reactionTouchEnd (e) {             
  reactionUp();                                            
  }
  

  
function reactionMouseMove (e) {            
  if (!drag) return;                                       
  reactionMove(e.clientX,e.clientY);                       
  }
  
  
function reactionTouchMove (e) {            
  if (!drag) return;                                       
  var obj = e.changedTouches[0];                           
  reactionMove(obj.clientX,obj.clientY);                   
  e.preventDefault();                                                            
  }  
  


function reactionDown (u, v) {
  var re = canvas.getBoundingClientRect();                 
  u -= re.left; v -= re.top;                               
  if (Math.abs(u-(X_POT+q*W_POT)) < 50) drag = true;        
  }
  
 

function reactionMove (u, v) {
  if (!drag) return;                                       
  var re = canvas.getBoundingClientRect();             
  u -= re.left; v -= re.top;                              
  if (u < X_POT) u = X_POT;                            
  if (u > X_POT+W_POT) u = X_POT+W_POT;                
  q = (u-X_POT)/W_POT;                                     
  sl.value = u-X_POT;
  input(true);                                             
  }
  
  
function reactionUp () {
  drag = false;                                            
  }
  

  
function reactionEnter (e) {
  if (e.key && String(e.key) == "Enter"                    
  || e.keyCode == 13)                  
    input(false);                                                 
  }



function newPartRGB (c, i) {
  var p = c.substring(i,i+2);                         
  var pp = Math.floor((2*parseInt(p,16)+255)/3);      
  return pp.toString(16);                                  
  }
  


function lightColor (c) {
  if (!c.startsWith('#')) return undefined;     
  if (c.length != 7) return undefined; 
  var r = newPartRGB(c,1);
  var g = newPartRGB(c,3);
  var b = newPartRGB(c,5);
  return "#"+r+g+b;                                        
  }

  
function voltageAppliance (q) {
  var r1 = q*rs, r2 = rs-r1;                               
  var r1v = r1*rv/(r1+rv);                                 
  return u0*r1v/(r1v+r2);                                  
  }



function ToString (n, d, fix) {
  var s = (fix ? n.toFixed(d) : n.toPrecision(d));        
  return s.replace(".",decimalSeparator);                  
  }
  
function value (r, n, u) {
  return ToString(r,n,true)+" "+u;                         
  }
  

    
function stringVoltage (u) {
  var s = ToString(u,2,true);                              
  while (s.length < 5) s = "0"+s;                          
  return s+" "+volt;                                    
  }
    
function updateInput() {
  ip1.value = ToString(u0,1,true);                         
  ip2.value = ToString(rs,0,true);
  sl.value = Math.round(q*200);                            
  ip3.value = ToString(rv,0,true);
  }
  

  
function inputNumber (ef, d, fix, min, max) {
  var s = ef.value;                                        
  s = s.replace(",",".");                                  
  var n = Number(s);                                       
  if (isNaN(n)) n = 0;
  if (n < min) n = min;                                    
  if (n > max) n = max;                                    
  ef.value = ToString(n,d,fix);                            
  return n;                                                
  }


function input (mouse) {
  u0 = inputNumber(ip1,1,true,0,10);                       
  rs = inputNumber(ip2,0,true,1,1000);                     
  rv = inputNumber(ip3,0,true,1,1000);                     
  if (!mouse) q = sl.value/200;                            
  uv = voltageAppliance(q);                                               
  paint();                                                 
  }
       


function newPath (w) {
  ctx.beginPath();                                         
  ctx.strokeStyle = "#000000";                             
  ctx.lineWidth = (w ? w : 1);                             
  }


function rectangle (x, y, w, h, c, lw) {
  newPath(lw ? lw : 1);                                    
  ctx.fillStyle = (c ? c : "#000000");                     
  ctx.fillRect(x,y,w,h);                                   
  ctx.strokeRect(x,y,w,h);                                 
  }
  


function line (x1, y1, x2, y2, c, w) {
  newPath(w);                                              
  if (c) ctx.strokeStyle = c;                              
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    
  ctx.stroke();                                            
  }

  	  
function radialLine (xM, yM, a, r1, r2, c, w) {
  var cos = Math.cos(a), sin = Math.sin(a);                
  line(xM+r1*cos,yM-r1*sin,xM+r2*cos,yM-r2*sin,c,w);      
  }
  


function arrow (x1, y1, x2, y2, w) {
  if (!w) w = 1;                                                                    
  var dx = x2-x1, dy = y2-y1;                              
  var length = Math.sqrt(dx*dx+dy*dy);                     
  if (length == 0) return;                                 
  dx /= length; dy /= length;                              
  var s = 2.5*w+7.5;
  var xSp = x2-s*dx, ySp = y2-s*dy;                        
  var h = 0.5*w+3.5;                                       
  var xSp1 = xSp-h*dy, ySp1 = ySp+h*dx;                    
  var xSp2 = xSp+h*dy, ySp2 = ySp-h*dx;                    
  xSp = x2-0.6*s*dx; ySp = y2-0.6*s*dy;
  ctx.beginPath();                                         
  ctx.lineWidth = w;                                       
  ctx.moveTo(x1,y1);                                       
  if (length < 5) ctx.lineTo(x2,y2);                       
  else ctx.lineTo(xSp,ySp);                                 
  ctx.stroke();                                            
  if (length < 5) return;                                   
  ctx.beginPath();                                         
  ctx.fillStyle = ctx.strokeStyle;                         
  ctx.moveTo(xSp,ySp);                                     
  ctx.lineTo(xSp1,ySp1);                                   
  ctx.lineTo(x2,y2);                                       
  ctx.lineTo(xSp2,ySp2);                                   
  ctx.closePath();                                         
  ctx.fill();                                              
  }
  

function circle (x, y, r, w, c) {
  if (c) ctx.fillStyle = c;
  ctx.beginPath();                                         
  ctx.lineWidth = w;
  ctx.arc(x,y,r,0,2*Math.PI,true);                         
  if (c) ctx.fill();
  ctx.stroke();                                            
  }
  

   
function centerText (s, x, y) {
  ctx.font = FONT;                                         
  ctx.textAlign = "center";                                
  ctx.fillText(s,x,y+DY);                                  
  }
  


function node (x, y) {
  newPath();                                               
  ctx.fillStyle = "#000000";                               
  ctx.arc(x,y,2.5,0,2*Math.PI,true);                       
  ctx.fill();                                              
  }
  

    
function wires () {
  newPath();                                               
  ctx.moveTo(185,350);                                     
  ctx.lineTo(360,350);                                     
  ctx.lineTo(360,230);
  ctx.lineTo(300,230);                                     
  ctx.moveTo(100,230);                                     
  ctx.lineTo(40,230);                                      
  ctx.lineTo(40,360);                                      
  ctx.lineTo(185,360);                                     
  var x = 100+q*200;                                       
  ctx.moveTo(x,170);                                       
  ctx.lineTo(200,170);                                     
  ctx.lineTo(200,80);                                      
  ctx.lineTo(130,80);                                      
  ctx.lineTo(130,50);                                      
  ctx.moveTo(110,50);                                       
  ctx.lineTo(110,80);                                      
  ctx.lineTo(40,80);                                       
  ctx.lineTo(40,230);                                      
  ctx.stroke();
  line(40,120,60,120);                                     
  line(180,120,200,120);                                   
  arrow(x,170,x,210);                                      
  for (var y=210; y<250; y+=2) line(x,y,x,y+1);      
  node(40,230);                                            
  node(40,120);                                            
  node(200,120);
  }
  

    
function power () {
  rectangle(170,310,60,60,lightColor(colorVoltage));
  node(185,350);                                           
  node(185,360);                                           
  circle(200,330,10,1,"#000000");                          
  var w = (210-u0*24)*DEG;                                 
  radialLine(200,330,w,0,10,"#ffffff",1.5);                
  for (var u=0; u<=10; u++) {                              
    w = (210-u*24)*DEG;                                    
    radialLine(200,330,w,10,14);                           
    }
  rectangle(173,349.5,7,1,"#000000");                      
  rectangle(176,346.5,1,7,"#000000");                       
  rectangle(190,359.5,7,1,"#000000");                      
  }
  

      
function resistors () {
  rectangle(100,210,200,40,colorBackground,2);               
  rectangle(60,100,120,40,colorBackground,2);                
  ctx.font = FONT;                                           
  ctx.fillStyle = "#000000";                                 
  centerText(value(rv,1,ohm),120,120);
  var s = value(rs,1,ohm);                                   
  s += " = "+value(q*rs,1,ohm);                                             
  s += " + "+value(rs-q*rs,1,ohm);                           
  centerText(s,200,230);
  }

      
function meter (x, y) {
    rectangle(x-70,y-20,140,40,lightColor(colorVoltage));    
  rectangle(x-60,y-15,120,20,"#000000");
  node(x-10,y+12);                                         
  node(x+10,y+12);                                         
  line(x-24,y+12,x-16,y+12);                               
  line(x+16,y+12,x+24,y+12);                               
  line(x+20,y+8,x+20,y+16);                                
  ctx.font = FONT2;                                        
  ctx.textAlign = "center";                                
  ctx.fillStyle = "#ff0000";                               
  ctx.fillText(stringVoltage(uv),x,y-1);                   
  }
      

      
function scale () {
  rectangle(88,253,224,22,colorScale);                     
  ctx.font = FONT;                                         
  ctx.textAlign = "center";                      
  ctx.fillStyle = "#000000";                     
  for (var x=100; x<=300; x+=4) {                          
    var long = (x%20 == 0);                               
    line(x,252,x,long?260:257);                     
    if (!long) continue;                                  
    var s = ToString((x-100)/200,true,1);                  
    ctx.fillText(s,x,270);                       
    }   	
  }
  

    
function writeTextIndex (s, i, x, y) {
  var ls = ctx.measureText(s).width;                      
  ctx.fillText(s,x,y);                                     
  ctx.fillText(i,x+ls+1,y+4);
  }

function writeV (u, x, y) {
  ctx.fillText(value(u,2,volt),x,y);                       
  }

  
function writeVoltage () {
  ctx.textAlign = "center";                                
  ctx.fillStyle = colorVoltage;                            
  ctx.font = FONT;                                         
  writeV(uv,120,96);
  var x = Math.round(100+q*200);
  var x1 = Math.min((100+x)/2,x-25);                       
  var x2 = Math.max((x+300)/2,x+25);                       
  writeV(uv,x1,206);                                       
  writeV(u0-uv,x2,206);                                    
  }
  

    
function writeA (i, x, y) {
  centerText(value(Math.abs(i),3,ampere),x,y);             
  }
  

  
function writeAmperage () {
  ctx.fillStyle = colorAmperage;                           
  ctx.font = FONT;                                         
  var iv = uv/rv;
  var i1 = (q>0 ? uv/(q*rs) : u0/rs);                      
  var i = i1+iv;                                           
  writeA(iv,120,148);                                   
  writeA(i1,70,238);                                       
  writeA(i,330,238);                                       
  }
  
// Diagramm:
  
function diagram () {
  var U0 = 240, V0 = 120;                                  
  var PIX1 = 100, PIX2 = 8;                                
  ctx.strokeStyle = "#000000";                             
  arrow(U0-10,V0,U0+120,V0);                               
  arrow(U0,V0+10,U0,V0-100);                               
  writeTextIndex(symbolVoltage1,symbolVoltage2,U0+10,V0-90);  
  ctx.textAlign = "center";                                
  for (var i=1; i<=5; i++) {                               
  	var u = U0+i*PIX1/5;                                   
  	line(u,V0-3,u,V0+3);                                   
  	ctx.fillText(ToString(i/5,true,1),u,V0+13);            
  	}
  ctx.textAlign = "right";                                 
  for (i=1; i<=5; i++) {                                   
  	var v = V0-i*2*PIX2;                                   
  	line(U0-3,v,U0+3,v);
  	ctx.fillText(value(2*i,0,volt),U0-4,v+4);              
  	}
  newPath();                                               
  ctx.moveTo(U0,V0);                                       
  for (u=U0; u<=U0+PIX1; u++) {                            
    var qq = (u-U0)/PIX1;                                  
    v = V0-PIX2*voltageAppliance(qq);                      
    ctx.lineTo(u,v);                                       
    }
  ctx.stroke();                                            
  u = U0+q*PIX1;                                          
  v = V0-PIX2*voltageAppliance(q);                        
  circle(u,v,2.5,1,colorVoltage);              
  }

  
function paint () {
  ctx.fillStyle = colorBackground;                    
  ctx.fillRect(0,0,width,height);                          
  resistors();                                   
  meter(120,40);                                             
  power();                                                
  wires();                                                
  scale();                                                 
  diagram();                                               
  if (cb1.checked) writeVoltage();                         
  if (cb2.checked) writeAmperage();                        
  }
  
document.addEventListener("DOMContentLoaded",start,false); 