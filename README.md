# canvas-3d

La classe __Canvas3D__ permet de migrer progressivement un jeu Javascript écrit pour un contexte 2D en un jeu pour contexte WebGL.
Pour cela, une instance de __Canvas3D__ peu se substituer à un __CanvasRenderingContext2D__ de façon transparente (du moins pour un sous-ensemble restreint de ses fonctionnalités).

``` js
// Remplacez cette ligne :
var ctx = canvas.getContext( "2d" );
// Par celle-ci :
var ctx = new Canvas3D( canvas );
```

Si votre jeu utilise seulement les propriétés et méthodes suivantes, il fonctionnera sans rien changer d'autre :

* [globalAlpha](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha)
* [fillStyle](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle)
  _pour le moment, seuls les formats `#xxx` et `#xxxxxx` sont reconnus_
* [fillRect( x, y, w, h )](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect)
* [restore()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/restore)
* [rotate()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate)
* [save()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save)
* [translate()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/translate)



