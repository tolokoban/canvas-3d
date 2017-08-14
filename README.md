# canvas-3d

La classe __Canvas3D__ permet de migrer progressivement un jeu Javascript écrit pour un contexte 2D en un jeu pour contexte WebGL.
Pour cela, une instance de __Canvas3D__ peu se substituer à un __CanvasRenderingContext2D__ de façon transparente (du moins pour un sous-ensemble restreint de ses fonctionnalités).

``` js
// Remplacez cette ligne :
var ctx = canvas.getContext( "2d" );
// Par celle-ci :
var ctx = new Canvas3D( canvas );
```

Si votre jeu utilise seulement les propriétés et méthodes suivantes, il fonctionnera sans rien changer d'autre (comparez les rendus sur la [page de tests](https://tolokoban.github.io/canvas-3d/index.html)) :

* [drawImage(img, dx, dy)](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)
* [globalAlpha](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha)
* [fillStyle](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle)
* [fillRect(x, y, w, h)](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect)
* [restore()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/restore)
* [rotate(a)](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate)
* [save()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save)
* [scale(sx, sy)](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scale)
* [translate(tx, ty)](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/translate)



