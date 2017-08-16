function nonifiant(){

}

function walkAnim(i){
    if (heros[i].nAnim%5 == 0){
        if (heros[i].nAnim%10 == 0){
            if (heros[i].img == 4) heros[i].img = 8;
            else heros[i].img = 4;
        }
        //console.log(heros[i].vy);
        if (heros[i].vx > 0) {heros[i].vx -= 10; }
        else if (heros[i].vy > 0) {heros[i].vy -= 10; }
        else if (heros[i].vx < 0) {heros[i].vx += 10; }
        else if (heros[i].vy < 0) {heros[i].vy += 10; }

        //console.log(heros[i].vy);
        
        if (Math.abs(heros[i].vx) < 10) heros[i].vx = 0;
        if (Math.abs(heros[i].vy) < 10) heros[i].vy = 0;

        if (heros[i].vx == 0 && heros[i].vy == 0){
            heros[i].anim = nonifiant;
            heros[i].nAnim = -1;
            heros[i].img = 0;
            if (heros[i].carry[0] == 1) heros[i].img = 12;
        }
    }
    heros[i].nAnim += 1;
}
