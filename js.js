/*window.saveDataAcrossSessions = true;
webgazer.setGazeListener(function(data, elapsedTime) {
    if(!isInit){
        if(data) {
            mouse = new Mouse(data.x, data.y);
            isInit = true;
            requestAnimationFrame(loop);
        }
    }
    else{
        if(data) {
            mouse.vx = data.x - mouse.x;
            mouse.vy = data.y - mouse.y;
            mouse.x = data.x;
            mouse.y = data.y;
        }
    }

}).begin();*/


class Canvas{
    constructor() {
        this.cnv = document.querySelector("#cnv");
        this.ctx = this.cnv.getContext("2d");
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.textWidth = 0;
        this.textHeight = 0;
        this.cnv.width = this.width;
        this.cnv.height = this.height;

        this.dataPoint = [];
        this.fillCnv();
        this.fillText("ОДУВАН4ИК");

    }
    fillCnv(bckg = "slategray"){
        this.ctx.fillStyle = bckg;
        this.ctx.fillRect(0,0,this.width,this.height);
    }
    fillText(txt = "TAKE U BACK",bckg = "black", wh=  200){
        this.ctx.fillStyle = bckg;
        this.ctx.textBaseline = "top";
        this.ctx.font = `bold ${wh}px Arial`;

        this.textWidth = Math.round(this.ctx.measureText(txt).width);
        this.textHeight = wh;
        console.log(this.textWidth, this.textHeight);

        this.ctx.fillText(txt, this.width/2 - this.textWidth/2, this.height/2 - wh/2);

        this.pointData(this.width/2 - this.textWidth/2, this.height/2 - wh/2, this.textWidth, this.textHeight);
    }
    pointData(w,h,wText,hText){
        let param = 1;


        for(let y = h;y<h+hText;y+=param){
            for(let x = w;x<w+wText;x+=param){
                let imgData = this.ctx.getImageData(x,y,1,1);
                if(imgData.data[0] == 0 && imgData.data[1] == 0 && imgData.data[2] == 0){
                    param = 7;
                    let r = 153/(wText) * x, g = 255/(hText), b = 153/(wText) * (y);
                    let style = `rgb(${r}, ${g}, ${b})`;
                    this.dataPoint.push(new Particle(x,y, style,r,g,b));
                }

            }
        }
        this.clear();

        for(let i = 0;i<this.dataPoint.length;i++){
            this.ctx.fillStyle = this.dataPoint[i].style;
            this.dataPoint[i].show(this.ctx);
        }
    }
    clear(bckg = "slategray"){
        this.ctx.fillStyle = bckg;
        this.ctx.fillRect(0,0,this.width,this.height);
    }

}
class Particle{
    constructor(x,y, style,r,g,b) {
        this.x = x;
        this.y = y;
        this.oldx = x;
        this.oldy = y;
        this.style = style;
        this.r = 3;
        this.m = Math.PI*this.r*this.r;
        this.vx = 0;
        this.vy = 0;
        this.prevvx = 0;
        this.prevvy = 0;
        this.mn = 0.99;
        this.returns = false;
        this.ignore = false;
        this.red = r;
        this.green = g;
        this.blue = b;
        this.mnx = 1;
        this.mny = 1;
    }
    show(ctx){
        ctx.beginPath();
        ctx.arc(this.x,this.y, 3, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }
    move(){

        this.vx *= this.mn;
        this.vy *= this.mn;
        this.x += this.vx;
        this.y += this.vy;
        //this.red = 255/(0.2*c.textWidth) * this.x;
        //this.green = 40/(0.5*c.textHeight) * this.y;
        //this.blue = 150/(0.5*c.textHeight+c.textWidth) * (this.y);

        if(Math.abs(this.vx) < 0.05 && Math.abs(this.vy ) < 0.05 && this.returns){
            this.vx = 0;
            this.vy = 0;
            this.ignore = false;
        }
        if(Math.abs(this.vx) < 0.05 && Math.abs(this.vy ) < 0.05 && !this.returns){
            this.vx = -this.prevvx;
            this.vy = -this.prevvy;
            this.returns = true;

        }
    }
    resonansce(){
        let xx = Math.random()*(1+1)-1;
        let yy = Math.random()*(1+1)-1;


        if(Math.abs((this.x + xx) - this.oldx) > 4){

        }
        else{
            this.x += xx;
        }
        if(Math.abs((this.y + yy) - this.oldy) > 4){

        }
        else{
            this.y += yy;
        }

    }

}
class Mouse{
    constructor(vx,vy) {
        this.x = 0;
        this.y = 0;
        this.vx = vx;
        this.vy = vy;
        this.r = 10;
        this.m = Math.PI*this.r*this.r;
    }
}
let c = new Canvas();
let mouse  = null;
let isInit = false;
function loop(){
    c.clear();
    for(let i = 0;i<c.dataPoint.length;i++){
        if(Math.abs(mouse.x-c.dataPoint[i].x) <= (c.dataPoint[i].r + mouse.r) && Math.abs(mouse.y-c.dataPoint[i].y) <= (c.dataPoint[i].r + mouse.r) && !c.dataPoint[i].ignore){
            let cc = Math.sqrt(Math.pow((mouse.x + mouse.r - c.dataPoint[i].x),2)+Math.pow((mouse.y - c.dataPoint[i].y),2));
            let a = mouse.r;
            let b = Math.sqrt(Math.pow((mouse.x - c.dataPoint[i].x),2)+Math.pow((mouse.y - c.dataPoint[i].y),2));
            let zncos = (a*a + b*b - cc*cc)/(2*a*b);
            let znsin = Math.sqrt(1-zncos*zncos);
            c.dataPoint[i].vx = zncos*4;
            c.dataPoint[i].ignore = true;
            if(mouse.y > c.dataPoint[i].y){
                c.dataPoint[i].vy = -znsin*4;
                c.dataPoint[i].prevvy = -znsin*4;
            }
            else{
                c.dataPoint[i].vy = znsin*4;
                c.dataPoint[i].prevvy = znsin*4;
            }

            c.dataPoint[i].prevvx = zncos*4;

            c.dataPoint[i].returns = false;

        }

    }
    for(let i = 0;i<c.dataPoint.length;i++){
        c.ctx.fillStyle = `rgb(${c.dataPoint[i].red},${c.dataPoint[i].green},${c.dataPoint[i].blue})`;
        if(c.dataPoint[i].vx != 0 && c.dataPoint[i].vy != 0)
            c.dataPoint[i].move();
        else{
            c.dataPoint[i].resonansce();
        }
        c.dataPoint[i].show(c.ctx);
        //c.dataPoint[i].show(c.ctx);
    }
   /* c.ctx.fillStyle = "red";
    c.ctx.beginPath();
    c.ctx.arc(mouse.x, mouse.y, 40, 0, Math.PI * 2);
    c.ctx.fill();
    c.ctx.closePath();*/
    requestAnimationFrame(loop);
}
document.onmousemove = (e)=>{
    if(!isInit){
        mouse = new Mouse(e.clientX,e.clientY);
        isInit = true;
        requestAnimationFrame(loop);
    }
    else{
        mouse.vx = e.clientX - mouse.x;
        mouse.vy = e.clientY - mouse.y;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        //c.clear();



    }


};



