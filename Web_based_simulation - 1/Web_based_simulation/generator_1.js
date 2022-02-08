
var colorBackground = "#f08080";
var colorNorth = "#ff0000";              
var colorSouth = "#00ff00";              
var colorContact = "#c0c0c0";                              
var colorInsulator = "#000000";          
var	colorCurrent1 = "#ff0000";                      
var colorCurrent2 = "#ff6060";                      
var colorCurrent3 = "#400000";                          
var	colorField = "#0000ff";              
var colorMotion = "#000000";             
var colorVoltage = "#0000ff";                              
var colorCrank = "#ffc800";              
var colorResistor = "#c080ff";           



var FONT = "normal normal bold 12px sans-serif";
var PI = Math.PI;                                          
var PI2 = 2*Math.PI;                                       
var PIH = Math.PI/2;                                       
var DEG = Math.PI/180;                                     
var PHI = 235*DEG;                                         
var THETA = 15*DEG;                                        
var 
var XM1 = 40;                                              
var YM1 = 5, YM2 = 300, YM3 = 400;                         
var ZM1 = 90, ZM2 = 110;
var XW1 = 130, XW2 = 140, XW3 = 220, XW4 = 260;
var YW1 = 0, YW2 = -90, YW3 = -110;
var ZW1 = -100, ZW2 = 75;
var YA1 = 80, YA2 = 200;
var ZA1 = 8, ZA2 = 30;
var XC1 = 0;                                               
var YC1 = 0, YC2 = -40;
var ZC1 = 36;                                              
var YC3 = -80, YC4 = -120;                                
var XV1 = 120, XV2 = 240;
var YV1 = -90, YV2 = -50;
var ZV1 = -120, ZV2 = 50, ZV3 = -50;
var XR1 = 60, XR2 = 100;
var U0 = 300, V0 = 250;
var INSMAX = 15*DEG;
var THICK = 2;                                             

// Attribute:

var canvas, ctx;
var width, height;                                         
var rb1, rb2;                                              
var bu1, bu2;                                              
var sl;                                                    
var op;                                                    
var cb1, cb2, cb3;                                         
var genDC;                                                 
var on;                                     
var timer;                                  
var t0;
var t;                                      
var omega;                                                 
var nPer;                                                  
var direction;                               
var current;                                               
var alpha;                                  
var sinAlpha, cosAlpha;                                    
var uRot, vRot;                          
var vArrows;                             
var bArrows;                             
var iArrows;                                               

var a1, a2, b1, b2, b3, c1, c2, c3;


var pgNorth, pgSouth;                    
var pgContact1;                                            
var pgContact2;
var pgContact3;
var pointContact1, pointContact2, pointContact3;           
var aEllipse, bEllipse;                                    
var deltaEllipse;
var pgInsulator1, pgInsulator2;          
var pgVoltmeter1;                                          
var pgVoltmeter2;                        
var pgVoltmeter3;                                          
var pointVoltmeter;                                        



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
  rb1 = getElement("rb1a");                                
  rb1.checked = true;
  getElement("rb1b",text01);                               
  rb2 = getElement("rb2a");                                
  getElement("rb2b",text02);                               
  bu1 = getElement("bu1",text03);                          
  sl = getElement("sl");                                   
  sl.value = 10;                                           
  op = getElement("op");                                   
  reactionSlider(false);                                   
  bu2 = getElement("bu2",text04[1]);                       
  setButton2State(1);
  cb1 = getElement("cb1a");                                
  getElement("cb1b",text05);                               
  cb2 = getElement("cb2a");                                
  getElement("cb2b",text06);                               
  cb3 = getElement("cb3a");                                
  getElement("cb3b",text07);                               
  cb1.checked = cb2.checked = cb3.checked = true;
  getElement("author",author);                             
  getElement("translator",translator);                     
  
  genDC = false;                                           
  nPer = 5;
  t = 0;                                                    
  alpha = 0; cosAlpha = 1; sinAlpha = 0;                   
  vArrows = bArrows = iArrows = true;                      
  direction = 1;                                           
  calcCoeff();                                             
  initPolygons();                                          
  calcEllipse();                                           
  startAnimation();                                        
  
  rb1.onclick = reactionRadio;                             
  rb2.onclick = reactionRadio;                             
  bu1.onclick = reactionReverse;                           
  sl.onchange = reactionSlider;
  sl.onclick = reactionSlider;                             
  bu2.onclick = reactionStart;                             
  cb1.onclick = reactionCheckbox;                       
  cb2.onclick = reactionCheckbox;                       
  cb3.onclick = reactionCheckbox;                       
  
  } 
  
function setButton2State (st) {
  bu2.state = st;                                          
  bu2.innerHTML = text04[st];                              
  }
  

  
function switchButton2 () {
  var st = bu2.state;                                      
  if (st == 0) st = 1;                                     
  else st = 3-st;                                           
  setButton2State(st);                                     
  }
  


function reactionRadio () {
  genDC = rb2.checked;  
  reset();                                                 
  }
    


function reactionStart () {
  if (bu2.state != 1) t0 = new Date();                     
  switchButton2();                                         
  if (bu2.state == 1) startAnimation();                    
  else stopAnimation();                                    
  }


function reactionReverse () {
  direction = -direction;                                  
  reset();                                                 
  }
 

  
function reset () {
  t = 0;                                                   
  alpha = 0; cosAlpha = 1; sinAlpha = 0;                   
  if (!on) paint();                                        
  }
  


function reactionSlider (r) {
  var n = sl.value;                                        
  omega = PI2*n/100;                                       
  var s = (n*0.6).toFixed(1);                              
  s = s.replace(".",decimalSeparator);                     
  if (n == 0) s = "0";                                     
  op.innerHTML = s+" "+rotationsPerMinute;                 
  nPer = Math.floor(n/2);                                   
  if (r != false) reset();                                 
  }
  


function reactionCheckbox () {
  vArrows = cb1.checked;                                   
  bArrows = cb2.checked;                                   
  iArrows = cb3.checked;                                   
  if (!on) paint();                                        
  }
  


function startAnimation () {
  on = true;
  timer = setInterval(paint,40);                           
  t0 = new Date();
  }
  


function stopAnimation () {
  on = false;
  clearInterval(timer);
  }
  


function initPolygons () {
  pgSouth = new Array(8);                                  
  setPoint(pgSouth,0,-XM1,YM3,0);
  setPoint(pgSouth,1,-XM1,YM3,-ZM2);
  setPoint(pgSouth,2,-XM1,YM1,-ZM2);
  setPoint(pgSouth,3,XM1,YM1,-ZM2);
  setPoint(pgSouth,4,XM1,YM1,-ZM1);
  setPoint(pgSouth,5,XM1,YM2,-ZM1);
  setPoint(pgSouth,6,XM1,YM2,0);
  setPoint(pgSouth,7,-XM1,YM2,0);
  pgNorth = new Array(9);                                  
  setPoint(pgNorth,0,-XM1,YM3,0);
  setPoint(pgNorth,1,-XM1,YM2,0);
  setPoint(pgNorth,2,XM1,YM2,0);
  var u0 = screenU(-XM1,YM1);
  var v0 = screenV(-XM1,YM1,ZM1);
  var u1 = screenU(-XM1,YM2);
  var v1 = screenV(-XM1,YM2,ZM1);  
  var uS = screenU(XM1,YM2);
  var q = (uS-u0)/(u1-u0);
  var vS = v0+q*(v1-v0);
  pgNorth[3] = {u: uS, v: vS};
  setPoint(pgNorth,4,-XM1,YM1,ZM1);
  setPoint(pgNorth,5,XM1,YM1,ZM1);
  setPoint(pgNorth,6,XM1,YM1,ZM2);
  setPoint(pgNorth,7,XM1,YM3,ZM2);
  setPoint(pgNorth,8,-XM1,YM3,ZM2);
  pgContact1 = new Array(6);                               
  pointContact1 = initContact(pgContact1,XC1,YC1,ZC1);     
  pgContact2 = new Array(6);                               
  pointContact2 = initContact(pgContact2,XC1,YC1,-ZC1);    
  pgContact3 = new Array(6);                               
  pointContact3 = initContact(pgContact3,XC1,YC2,-ZC1);    
  pgVoltmeter1 = new Array(6);                             
  pointVoltmeter = initCuboid(pgVoltmeter1,XV1,XV2,YV1,YV2,ZV1,ZV2); 
  pgVoltmeter2 = new Array(4);                             
  setPoint(pgVoltmeter2,0,XV1,YV1,ZV3);
  setPoint(pgVoltmeter2,1,XV2,YV1,ZV3);
  setPoint(pgVoltmeter2,2,XV2,YV1,ZV2);
  setPoint(pgVoltmeter2,3,XV1,YV1,ZV2);
  pgVoltmeter3 = new Array(4);
  pgVoltmeter3[0] = pgVoltmeter1[1];
  pgVoltmeter3[1] = pgVoltmeter1[2];
  pgVoltmeter3[2] = pgVoltmeter2[1];
  pgVoltmeter3[3] = pgVoltmeter2[0];
  pgInsulator1 = new Array(20);                            
  pgInsulator2 = new Array(20);                            
  for (i=0; i<20; i++) {
    pgInsulator1[i] = {u: 0, v: 0};
    pgInsulator2[i] = {u: 0, v: 0};
    }
  }

  
function calcCoeff () {
  a1 = -Math.sin(PHI); a2 = Math.cos(PHI);                 
  b1 = Math.sin(THETA)*a2; b2 = -Math.sin(THETA)*a1;       
  b3 = -Math.cos(THETA);
  c1 = a2*b3; c2 = -a1*b3; c3 = a1*b2-a2*b1;               
  }

  
function screenU (x, y) {
  return U0+a1*x+a2*y;
  }


      
function screenV (x, y, z) {
  return V0+b1*x+b2*y+b3*z;
  }
  


  
function setPoint (p, i, x, y, z) {
  p[i]= {u: screenU(x,y), v: screenV(x,y,z)};
  }

  
function setPointRot (p, i, x, y, z) {
  screenCoordsRot(x,y,z);                                  
  p[i].u = uRot; p[i].v = vRot;                            
  }
 

      
function initCuboid (pg, xx1, xx2, yy1, yy2, zz1, zz2) {
  pg[0] = {u: screenU(xx1,yy2), v: screenV(xx1,yy2,zz1)};  
  pg[1] = {u: screenU(xx1,yy1), v: screenV(xx1,yy1,zz1)};  
  pg[2] = {u: screenU(xx2,yy1), v: screenV(xx2,yy1,zz1)};  
  pg[3] = {u: screenU(xx2,yy1), v: screenV(xx2,yy1,zz2)};  
  pg[4] = {u: screenU(xx2,yy2), v: screenV(xx2,yy2,zz2)};  
  pg[5] = {u: screenU(xx1,yy2), v: screenV(xx1,yy2,zz2)};  
  return {u: screenU(xx1,yy1), v: screenV(xx1,yy1,zz2)};   
  }
 

function initContact (pg, x, y, z) {
  return initCuboid(pg,x-HC,x+HC,y-HC,y+HC,z-HC,z+HC);
  }
  


function moveTo (x, y, z) {
  ctx.moveTo(screenU(x,y),screenV(x,y,z));
  }
  


function lineTo (x, y, z) {
  ctx.lineTo(screenU(x,y),screenV(x,y,z));
  }
  


function screenCoordsRot (x, y, z) {
  var xx = x*cosAlpha-z*sinAlpha;                          
  var zz = x*sinAlpha+z*cosAlpha;                          
  uRot = U0+a1*xx+a2*y;                                    
  vRot = V0+b1*xx+b2*y+b3*zz;                              
  }
  

function moveToRot (x, y, z) {
  screenCoordsRot(x,y,z);                                  
  ctx.moveTo(uRot,vRot);                                   
  }



function lineToRot (x, y, z) {
  screenCoordsRot(x,y,z);                                  
  ctx.lineTo(uRot,vRot);                                   
  }  
  
function calcEllipse () {
  var r = ZC1-HC;                                          
 
  var c = a1*r, d = -b3*r, m = b1/a1;   
  
  var c11 = c*c*m*m+d*d;                                   
  var c12 = -m*c*c;                                        
  var c22 = c*c;                                           
  var c0 = -c*c*d*d;                                       
  var bq = -c*c*(1+m*m)-d*d;                               
  var cq = c*c*d*d;                                        
  var discr = bq*bq-4*cq;
  aEllipse = Math.sqrt((-bq-Math.sqrt(discr))/2);           
  bEllipse = c*d/aEllipse;                                 
  deltaEllipse = Math.atan(2*c12/(c22-c11))/2;             
  }



function newPath (w) {
  ctx.beginPath();                                         
  ctx.strokeStyle = "#000000";                             
  ctx.lineWidth = (w ? w : 1);
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
  ctx.lineWidth = 1;
  ctx.fillStyle = ctx.strokeStyle;                         
  ctx.moveTo(xSp,ySp);                                     
  ctx.lineTo(xSp1,ySp1);
  ctx.lineTo(x2,y2);                                    
  ctx.lineTo(xSp2,ySp2);                                   
  ctx.closePath();                                         
  ctx.fill();                                              
  }
  

function lineRot (x1, y1, z1, x2, y2, z2, c, w) {
  newPath(w);                                              
  ctx.strokeStyle = c;
  moveToRot(x1,y1,z1);
  lineToRot(x2,y2,z2);
  ctx.stroke();                                            
  }
  

  
function arrowRot (x1, y1, z1, x2, y2, z2) {
  var xx1 = x1*cosAlpha-z1*sinAlpha;                       
  var zz1 = x1*sinAlpha+z1*cosAlpha;                       
  var xx2 = x2*cosAlpha-z2*sinAlpha;                       
  var zz2 = x2*sinAlpha+z2*cosAlpha;                       
  var u1 = screenU(xx1,y1), v1 = screenV(xx1,y1,zz1);      
  var u2 = screenU(xx2,y2), v2 = screenV(xx2,y2,zz2);   
  arrow(u1,v1,u2,v2,THICK);                                
  }
  

  
function arrowLine (x1, y1, z1, x2, y2, z2, q, d) {
  var u1 = screenU(x1,y1), v1 = screenV(x1,y1,z1);         
  var u2 = screenU(x2,y2), v2 = screenV(x2,y2,z2);         
  var du = u2-u1, dv = v2-v1;                              
    if (d) arrow(u1,v1,u1+q*du,v1+q*dv,THICK);               
  else arrow(u2,v2,u2-q*du,v2-q*dv,THICK);                 
  }
  

function arrowLineRot (x1, y1, z1, x2, y2, z2, q, d) {
  var xx1 = x1*cosAlpha-z1*sinAlpha;                       
  var zz1 = x1*sinAlpha+z1*cosAlpha;                       
  var xx2 = x2*cosAlpha-z2*sinAlpha;                       
  var zz2 = x2*sinAlpha+z2*cosAlpha;                       
  arrowLine(xx1,y1,zz1,xx2,y2,zz2,q,d);                    
  }
  


function drawPolygon (p, c) {
  newPath();                                               
  ctx.fillStyle = c
  ctx.moveTo(p[0].u,p[0].v);                               
  for (var i=1; i<p.length; i++)                           
    ctx.lineTo(p[i].u,p[i].v);                             
  ctx.closePath();                                         
  ctx.fill(); ctx.stroke();                                
  }
  


function line (u1, v1, u2, v2) {
  newPath();                                               
  ctx.moveTo(u1,v1); ctx.lineTo(u2,v2);
  ctx.stroke();
  }
  


function lineP (u, v, p, i) {
  line(u,v,p[i].u,p[i].v);                                 
  }
  


function circle (u, v, r, c) {
  newPath();                                               
  ctx.fillStyle = c
  ctx.arc(u,v,r,0,PI2,true);
  ctx.fill();
  }
  


function magnetSouth () {
  drawPolygon(pgSouth,colorSouth);                         
  var u1 = screenU(-XM1,YM2);
  var v1 = screenV(-XM1,YM2,-ZM1);
  lineP(u1,v1,pgSouth,5);                                  
  lineP(u1,v1,pgSouth,7);
  var u2 = screenU(-XM1,YM1);
  var v2 = screenV(-XM1,YM1,-ZM1);
  lineP(u2,v2,pgSouth,2);
  lineP(u2,v2,pgSouth,4);                                    
  line(u1,v1,u2,v2);                                        
  }
  


function magnetNorth () {  
    drawPolygon(pgNorth,colorNorth);
    var u1 = screenU(-XM1,YM2);                              
    var v1 = screenV(-XM1,YM2,ZM1);                          
    lineP(u1,v1,pgNorth,1);                                 
    lineP(u1,v1,pgNorth,3);                                  
    var u2 = screenU(-XM1,YM1);                              
    var v2 = screenV(-XM1,YM1,ZM2);                          
    lineP(u2,v2,pgNorth,4);                                 
    lineP(u2,v2,pgNorth,6);                                  
    lineP(u2,v2,pgNorth,8);                                  
  }
  

function colorCurrent () {
  return (current!=0 ? colorCurrent1 : "#000000");
  }


function halfArmature (i) {
  var dir = 0;                                             
  var sign = 3-2*i;                                         
  if (cosAlpha > 0 && current != 0) dir = direction;       
  if (cosAlpha < 0 && current != 0) dir = -direction;       
  newPath(THICK);
  ctx.strokeStyle = colorCurrent();                        
  var z1 = sign*ZA1, z2 = sign*ZA2;                        
  moveToRot(0,0,z1);
  lineToRot(0,YA1,z1);                                     
  lineToRot(0,YA1,z2);                                     
  lineToRot(0,YA2,z2);                                     
  lineToRot(0,YA2,0);                                      
  ctx.stroke();
  if (iArrows && current != 0 && omega > 0)                
    arrowLineRot(0,YA1,z2,0,YA2,z2,0.75,sign*dir<0);       
  } 
  


function movementArrow (i) {
  if (!vArrows || omega <= 0) return;                      
  var dir = (3-2*i)*direction;                             
  newPath();
  ctx.strokeStyle = colorMotion;                           
  var y = (YA1+YA2)/2;                                                                        
  if (i == 1) arrowRot(0,y,ZA2,-40*dir,y,ZA2);
  if (i == 2) arrowRot(0,y,-ZA2,-40*dir,y,-ZA2);
  }  
  


function fieldLines (i1, i2) {
  if (!cb2.checked) return;                                
  ctx.beginPath();                                         
  ctx.lineWidth = THICK;                                   
  ctx.strokeStyle = colorField;                            
  var y0 = (YA2+YA1)/2;                                    
  for (i=i1; i<=i2; i++) {                                 
    var y1 = y0+i*36;                                      
    moveTo(0,y1,-ZM1);
    lineTo(0,y1,ZM1);
    }
  ctx.stroke();
  for (i=i1; i<=i2; i++) {                                 
    var y1 = y0+i*36;                                      
    arrowLine(0,y1,ZM1,0,y1,-ZM1,0.25,true);               
    arrowLine(0,y1,ZM1,0,y1,-ZM1,0.85,true);               
    }
  }
  

  
function addEllipticalArc (u, v, a, b, delta, w0, w1) {
  ctx.save();                                              
  ctx.translate(u,v);                                      
  ctx.rotate(-delta);                                      
  ctx.scale(a,b);                                          
  ctx.arc(0,0,1,w0,w1,true);                              
  ctx.restore();                                          
  }
  

  
function cylinder (y, c) {
  var u = screenU(0,y+HC), v = screenV(0,y+HC,0);
  newPath();                                               
  ctx.fillStyle = c;
  addEllipticalArc(u,v,aEllipse,bEllipse,deltaEllipse,1.5*PI,0.5*PI);  
  u = screenU(0,y-HC); v = screenV(0,y-HC,0);              
  ctx.lineTo(u+bEllipse*Math.sin(deltaEllipse),v+bEllipse*Math.cos(deltaEllipse));
  addEllipticalArc(u,v,aEllipse,bEllipse,deltaEllipse,0.5*PI,1.5*PI);  
  ctx.closePath();                                         
  ctx.fill(); ctx.stroke();                                
  newPath();                                               
  addEllipticalArc(u,v,aEllipse,bEllipse,deltaEllipse,0,PI2); 
  ctx.stroke();                                            
  }

  
function ring (y, c) {
  var u0 = screenU(0,y+HC), v0 = screenV(0,y+HC,0);
  newPath();                                               
  ctx.fillStyle = c;                                       
  addEllipticalArc(u0,v0,aEllipse,bEllipse,deltaEllipse,1.5*PI,0.5*PI);   
  var u1 = screenU(0,y-HC), v1 = screenV(0,y-HC,0);        
  ctx.lineTo(u1+bEllipse*Math.sin(deltaEllipse),v1+bEllipse*Math.cos(deltaEllipse)); 
  addEllipticalArc(u1,v1,aEllipse,bEllipse,deltaEllipse,0.5*PI,1.5*PI);   
  ctx.lineTo(u0-bEllipse*Math.sin(deltaEllipse),v0-bEllipse*Math.cos(deltaEllipse)); 
  ctx.moveTo(u1-0.75*aEllipse*Math.cos(deltaEllipse),v1+0.75*aEllipse*Math.sin(deltaEllipse)); 
  addEllipticalArc(u1,v1,-0.75*aEllipse,0.75*bEllipse,deltaEllipse,0,PI2); 
  ctx.fill(); ctx.stroke();                                 
  newPath();                                                
  ctx.fillStyle = colorCurrent3;                            
  addEllipticalArc(u1,v1,0.75*aEllipse,0.75*bEllipse,deltaEllipse,0.5*PI,1.5*PI); 
  addEllipticalArc(u0,v0,-0.75*aEllipse,0.75*bEllipse,deltaEllipse,1.45*PI,0.55*PI); 
  ctx.fill(); ctx.stroke();                                 
  newPath();                                                
  addEllipticalArc(u1,v1,aEllipse,bEllipse,deltaEllipse,0,PI2); 
  ctx.stroke();                                             
  }
  


function mark (y) {
  var r = 0.87*(ZC1-HC);                                   
  var x = -r*sinAlpha, z = r*cosAlpha;                     
  var uM = screenU(x,y), vM = screenV(x,y,z);              
  circle(uM,vM,2,"#ffffff");                               
  }
  


function leftRing () {
  if (sinAlpha > 0)                                        
    lineRot(0,YC1,ZA1,0,YC1,0.75*(ZC1-HC),colorCurrent1,2);
  ring(YC1,colorCurrent2);                                 
  mark(YC1-HC);                                            
  if (sinAlpha < 0)                                        
    lineRot(0,YC1,ZA1,0,YC1,0.75*(ZC1-HC),colorCurrent1,2); 
  if (!genDC)                                              
    lineRot(0,YC1,-ZA1,0,YC2,-ZA1,colorCurrent1,2);        
  }
  


function rightRing () {
  lineRot(0,YC2,-ZA1,0,YC2,0.75*(-ZC1+HC),colorCurrent1,2);
  ring(YC2,colorCurrent2);                                 
  mark(YC2-HC);                                            
  if (sinAlpha > 0)                                        
    lineRot(0,YC2,-ZA1,0,YC2,0.75*(-ZC1+HC),colorCurrent1,2); 
  }
  

  
function commutator () {
  var color = (current!=0 ? colorCurrent2 : colorContact); 
  cylinder(YC1,color);                                    
  var dw = INSMAX/5;                                       
  var r = ZC1-HC;                                          
  for (i=0; i<20; i++) {                                   
    var w = (i<10 ? (i-5)*dw : (i-15)*dw+PI);
    var xx = r*Math.cos(w);                                
    var zz = r*Math.sin(w);                                
    setPointRot(pgInsulator1,i,xx,-HC,zz);
    }

  var seite = c1*cosAlpha+c3*sinAlpha;                     
  for (i=0; i<10; i++) {                                   
    var w = (i-5)*dw;                                      
    if (seite > 0) w += PI;                                
    var xx = r*Math.cos(w);                                
    var zz = r*Math.sin(w);                                
    setPointRot(pgInsulator2,i,xx,-HC,zz);                 
    setPointRot(pgInsulator2,19-i,xx,HC,zz);               
    }
  drawPolygon(pgInsulator1,colorInsulator);                 
  drawPolygon(pgInsulator2,colorInsulator);                
  }


function crank (y) {
  cylinder(y,colorCrank);                                  
  var r = 24;                                              
  var x = -r*sinAlpha, z = r*cosAlpha;
  var u0 = screenU(x,y-HC), v0 = screenV(x,y-HC,z);
  newPath();                                               
  ctx.fillStyle = colorCrank;                              
  var a = aEllipse/12, b = bEllipse/12;                    
  addEllipticalArc(u0,v0,a,b,deltaEllipse,1.5*PI,0.5*PI);
  var u1 = screenU(x,y-36), v1 = screenV(x,y-36,z);        
  ctx.lineTo(u1+b*Math.sin(deltaEllipse),v1+b*Math.cos(deltaEllipse)); 
  addEllipticalArc(u1,v1,a,b,deltaEllipse,0.5*PI,1.5*PI);  
  ctx.closePath();                                         
  ctx.fill(); ctx.stroke();                                
  newPath();
  addEllipticalArc(u1,v1,a,b,deltaEllipse,0,PI2);          
  ctx.stroke();                                            
  }
  


function contact (pg, pt) {
  var col = (current!=0 ? colorCurrent2 : colorContact);   
  drawPolygon(pg,col);                       
  var u = pt.u, v = pt.v;                                  
  lineP(u,v,pg,1);                                    
  lineP(u,v,pg,3);                                        
  lineP(u,v,pg,5);                                        
  }
  


function voltmeter (rv) {
  drawPolygon(pgVoltmeter1,colorVoltage);                  
  var u = pointVoltmeter.u, v = pointVoltmeter.v;          
  lineP(u,v,pgVoltmeter1,1);
  lineP(u,v,pgVoltmeter1,3);                               
  lineP(u,v,pgVoltmeter1,5);                               
  drawPolygon(pgVoltmeter2,"#ffffff");                     
  newPath(THICK);                                          
  var x0 = (XW2+XW3)/2;                                    
  var wMax = 0.36;                                         
  var w = wMax*rv;                                         
  moveTo(x0,YW2,ZW1);                                      
  lineTo(x0+125*Math.sin(w),YW2,ZW1+125*Math.cos(w));      
  ctx.stroke();                                            
  drawPolygon(pgVoltmeter3,colorVoltage);                  
  u = screenU(XW2,YW2); v = screenV(XW2,YW2,ZW1);          
  circle(u,v,3,"#000000");                                 
  u = screenU(XW3,YW2); v = screenV(XW3,YW2,ZW1);          
  circle(u,v,3,"#000000");                                 
  newPath(THICK);                                          
  ctx.strokeStyle = colorCurrent();                        
  moveTo(XW2,YW2,ZW1);                                     
  lineTo(XW2,YW3,ZW1);                                     
  lineTo(XC1,YW3,ZW1);                                     
  moveTo(XW3,YW2,ZW1);                                     
  lineTo(XW3,YW3,ZW1);                                     
  lineTo(XW4,YW3,ZW1);                                     
  ctx.stroke();                                            
  if (iArrows && current != 0)                             
    arrowLine(XC1,YW3,ZW1,XW2,YW3,ZW1,0.6+current*0.3,current<0); 
  newPath(3);                                              
  moveTo(XW2-8,YW2,ZW1+15);                                
  lineTo(XW2+8,YW2,ZW1+15);                                
  moveTo(XW3-8,YW2,ZW1+15);                                
  lineTo(XW3+8,YW2,ZW1+15);                                
  moveTo(XW3,YW2,ZW1+23);                                  
  lineTo(XW3,YW2,ZW1+7);                                   
  moveTo(x0-7,YW2,ZW1+23);                                 
  lineTo(x0,YW2,ZW1+5);
  lineTo(x0+7,YW2,ZW1+23);                                 
  ctx.stroke();                                            
  newPath(2);                                              
  for (var i=-2; i<=2; i++) {                              
    if (i == 0) continue;                                  
    w = i*wMax/2;                                          
    var sin = Math.sin(w), cos = Math.cos(w);              
    moveTo(x0+130*sin,YW2,ZW1+130*cos);                    
    lineTo(x0+140*sin,YW2,ZW1+140*cos);                    
    }
  ctx.stroke();                                            
  ctx.fillStyle = "#000000";                            
  ctx.textAlign = "center";                             
  ctx.fillText("0",screenU(x0,YW2),screenV(x0,YW2,ZW1+130));  
  }
  


function wires1 () {
  newPath(THICK);                                          
  ctx.strokeStyle = colorCurrent();
  moveTo(0,YW1,ZC1+HC);                                     
  lineTo(0,YW1,ZW2);                                        
  lineTo(XW1,YW1,ZW2);                                     
  lineTo(XW1,YW1,ZW1);                                      
  lineTo(XW4,YW1,ZW1);                                     
  lineTo(XW4,YW3,ZW1);                                     
  ctx.stroke();                                            
  if (iArrows && current != 0)                             
    arrowLine(0,YW1,ZW2,XW1,YW1,ZW2,0.5,current>0);        
  }
  


function wires2 () {
  newPath(THICK);                                          
  ctx.strokeStyle = colorCurrent();                        
  var y = (genDC ? YC1 : YC2);                             
  moveTo(XC1,y,-ZC1-HC);                                    
  lineTo(XC1,y,ZW1);                                        
  lineTo(XC1,YW3,ZW1);                                     
  ctx.stroke();                                            
  }
      


function resistor () {
  var c = colorCurrent();                                  
  var uR = screenU(XW1,YC1), vR = screenV(XW1,YC1,ZW1);    
  circle(uR,vR,3,c);                                       
  newPath(THICK);                                          
  ctx.strokeStyle = c;
  moveTo(XR2,YC1,ZW1);                                     
  lineTo(XW1,YC1,ZW1);                                     
  ctx.stroke();                                            
  newPath();
  ctx.fillStyle = colorResistor;                           
  var u0 = screenU(XR1,YC1), v0 = screenV(XR1,YC1,ZW1);    
  var d = 100*DEG;                                         
  addEllipticalArc(u0,v0,10,8,d,0,PI);                     
  var u1 = screenU(XR2,YC1), v1 = screenV(XR2,YC1,ZW1);    
  addEllipticalArc(u1,v1,10,8,d,PI,0);                                
  ctx.closePath();                                         
  ctx.fill(); ctx.stroke();                                
  newPath();                                               
  addEllipticalArc(u0,v0,10,8,d,0,PI2);                    
  ctx.stroke();                                            
  ctx.fillStyle = "#000000";                               
  ctx.textAlign = "center";                                
  ctx.fillText(symbolResistor,0.4*u0+0.6*u1,0.4*v0+0.6*v1+4); 
  var y = (genDC ? YC1 : YC2);                             
  var uL = screenU(0,y), vL = screenV(0,y,ZW1);            
  circle(uL,vL,3,c);                                       
  newPath(THICK);                                          
  ctx.strokeStyle = c;                                     
  moveTo(0,y,ZW1);                                         
  lineTo(0,YC1,ZW1);                                         
  lineTo(XR1,YC1,ZW1);                                     
  ctx.stroke();                                            
  }
      


function dvDiagram (du, f1, f2) {
  var dv = f2*Math.cos(du*f1);                             
  if (genDC) dv = Math.abs(dv);                            
  return direction*dv;                                     
  }
  


function diagram (u, v) {
  newPath();                                               
  arrow(u-10,v,u+215,v);                                   
  var pixT = 4;                                            
  for (var i=1; i<=5; i++) {                               
    var uT = u+i*10*pixT;                                  
    line(uT,v-3,uT,v+3);                                   
    }
  ctx.fillStyle = "#000000";                               
  ctx.textAlign = "center";                                
  ctx.fillText(symbolTime,u+210,v+15);                     
  arrow(u,v+45,u,v-45);                                    
  for (i=-2; i<=2; i++) {                                  
    var vT = v+i*15;                                       
    line(u-3,vT,u+3,vT);                                   
    }
  ctx.textAlign = "right";                                 
  ctx.fillText(symbolVoltage,u-5,v-35);                    
  var a = 75*omega/PI;                                     
  var f1 = omega/pixT;                                     
  newPath();                                               
  ctx.moveTo(u,v-direction*a);                             
  var uu = u;                                              
  while (uu < u+200) {                                      
    uu += 0.5;                                             
    var vv = v-dvDiagram(uu-u,f1,a);                       
    
    ctx.lineTo(uu,vv);                                     
    }
  ctx.stroke();                                            
  var u0 = u+t*pixT;                                       
  var v0 = v-dvDiagram(u0-u,f1,a);                         
  circle(u0,v0,2.5,colorVoltage);                          
  }
  

  
function paint () {
  ctx.fillStyle = colorBackground;                         
  ctx.fillRect(0,0,width,height);                          
  ctx.font = FONT;                                         
  current = 0;                                             
  if (cosAlpha > 0) current = 1;                           
  else if (cosAlpha < 0) current = -1;                     
  if (genDC) current = Math.abs(current);                  
  current *= direction;                                    
  if (on && omega > 0) {                                   
    var t1 = new Date();
    var dt = (t1-t0)/1000;                                 
    t += dt;                                               
    t0 = t1;                                               
    alpha += direction*omega*dt;                           
    var n = Math.floor(alpha/PI2);                         
    if (alpha >= 0) alpha -= n*PI2;                        
    else alpha -= (n-1)*PI2;                               
    if (omega > 0 && t > nPer*PI2/omega)                   
      t -= nPer*PI2/omega;                                 
    cosAlpha = Math.cos(alpha);                            
    sinAlpha = Math.sin(alpha);                            
    } 
  var dw = (genDC ? 0.05 : 0);                             
  if (Math.abs(sinAlpha) > 1-dw) current = 0;              
  magnetSouth();                                           
  var qu = Math.floor(alpha/PIH);                          
  if (direction == -1) qu = (qu%2==0 ? qu+1 : qu-1);       
  switch(qu) {                                             
    case 0:
      movementArrow(2);                                    
      halfArmature(2);                                     
      fieldLines(-2,2);                                    
      halfArmature(1);                                     
      movementArrow(1); break;                             
    case 1:
      fieldLines(2,2);                                     
      halfArmature(2);                                     
      fieldLines(0,1);                                     
      movementArrow(2);                                    
      movementArrow(1);                                    
      fieldLines(-2,-1);                                   
      halfArmature(1); break;                              
    case 2:
      movementArrow(1);                                    
      halfArmature(1);                                     
      fieldLines(-2,2);                                    
      halfArmature(2);                                     
      movementArrow(2); break;                             
    case 3:
      fieldLines(2,2);                                     
      halfArmature(1);                                     
      fieldLines(0,1);                                     
      movementArrow(1);                                    
      movementArrow(2);                                    
      fieldLines(-2,-1);                                   
      halfArmature(2); break;                              
      }
  magnetNorth();                                           
  wires2();
  if (genDC) {                                             
    contact(pgContact2,pointContact2);                     
    commutator();                                          
    contact(pgContact1,pointContact1);                     
    resistor();                                            
    wires1();                                              
    crank(YC3);                                            
    voltmeter(direction*5*omega*Math.abs(cosAlpha)/PI2);   
    }
  else {                                                   
    contact(pgContact3,pointContact3);                     
    leftRing(); rightRing();                               
    contact(pgContact1,pointContact1);                     
    resistor();                                            
    wires1();                                              
    crank(YC4);                                            
    voltmeter(direction*5*omega*cosAlpha/PI2);             
    }
  diagram(360,65);                                         
  }
  
document.addEventListener("DOMContentLoaded",start,false); 



