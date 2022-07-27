//select canvas
const cvs=document.getElementById("pong");
const ctx=cvs.getContext("2d");

// creating user Paddle
const user={
    x:0,
    y:cvs.height/2-100/2,
    width:10,
    height:100,
    color:"white",
    score:0

}
// creating com Paddle

const com={
    x:cvs.width-10,
    y:cvs.height/2-100/2,
    width:10,
    height:100,
    color:"white",
    score:0

}
// creating ball

const ball={
    x:cvs.width/2,
    y:cvs.height/2,
    radius:10,
    speed:5,
    velocityX:5,
    velocityY:5,
    color:"white"
}

//creating a net

const net={
    x:cvs.width/2-1,
    y:0,
    width:2,
    height:10,
    color:"white"
}

// function for drawing net

function drawNet(){
    for(let i=0;i<=cvs.height;i+=15)
    {
        drawRect(net.x,net.y+i,net.height,net.width,net.color);
    }
}

//creating a court to Play 

function drawRect(x,y,h,w,color)
{
    ctx.fillStyle=color;
    ctx.fillRect(x,y,w,h);
}

// function for creating circle

function drawCircle(x,y,r,color)
{
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
}


// draw Text

function drawText(text,x,y,color)
{
    ctx.fillStyle=color;
    ctx.font="45px fantasy";
    ctx.fillText(text,x,y);
}


// Render function to start making the props of came

function render()
{
    // clear the canvas court
    drawRect(0,0,cvs.height,cvs.width,"Black");

    // draw the Net means centerline to play
    drawNet();

    //draw Text for score
    drawText(user.score,cvs.width/4,cvs.height/5,"white");
    drawText(com.score,3*cvs.width/4,cvs.height/5,"white");

    //draw the user and com paddle
    drawRect(user.x,user.y,user.height,user.width,user.color);
    drawRect(com.x,com.y,com.height,com.width,com.color);

    //draw ball
    drawCircle(ball.x,ball.y,ball.radius,ball.color);
}

// functuon for controlling the user Paddle

cvs.addEventListener("mousemove",movePaddle);

function movePaddle(evt)
{
    let rect=cvs.getBoundingClientRect();
    user.y=evt.clientY-rect.top-user.height/2;
}

// function reset the ball to center

function resetBall()
{
    ball.x=cvs.width/2;
    ball.y=cvs.height/2;
    ball.speed=5;
    ball.velocityX=-ball.velocityX;
}

// function for decting collision of ball
 function Collision(b,player){
    b.top=b.y-b.radius;
    b.bottom=b.y+b.radius;
    b.left=b.x-b.radius;
    b.right=b.x+b.radius;

    player.top=player.y;
    player.bottom=player.y+player.height;
    player.left=player.x;
    player.right=player.x+player.width;

    return b.right>player.left && b.bottom>player.top && b.left<player.right && b.top<player.bottom;
 } 

// function to update pos,move,score....

function update()
{
    ball.x+=ball.velocityX;
    ball.y+=ball.velocityY;

    //simple AI to control the com Paddle

    let complevel=0.1;
    com.y+=(ball.y-(com.y+com.height/2))*complevel;

    if(ball.y+ball.radius>cvs.height || ball.y-ball.radius<0)
    {
        ball.velocityY = -ball.velocityY;
    }

    let player=(ball.x<cvs.width/2)?user:com;

    if(Collision(ball,player))
    {
        //where the ball hit the player
        let collidePoint=ball.y-(player.y+player.height/2);

        //Normalisation
        collidePoint=collidePoint/(player.height/2);
        
        //calculate the angle in Radian
        let angleRad=collidePoint*Math.PI/4;
        
        // X direction when ball its the paddle

        let direction=(ball.x<cvs.width/2)? 1 : -1;


        //change velocity of ball in X and Y
        ball.velocityX=direction*ball.speed*Math.cos(angleRad);
        ball.velocityY=ball.speed*Math.sin(angleRad);

        // everytime the ball hits paddle we increase its speed
        ball.speed+=0.5;

        

    }
    
    //update the score

    if(ball.x-ball.radius<0)
    {
        //com win
        com.score++;
        resetBall();
    }
    else if(ball.x+ball.radius>cvs.width)
    {
        //user win;
        user.score++;
        resetBall();
    }


}

// game start
 function game()
 {
    update();
    render();
 }

 //loop
 const framePerSecond=50;
 setInterval(game,1000/framePerSecond);