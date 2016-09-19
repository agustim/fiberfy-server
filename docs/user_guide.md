# fiberfy

## Manual d'Usuari

L'objectiu principal de l'eina és posicionar en el mapa, tant la distribució física dels elements de la fibra (a partir d'ara Obra civil), com els desplegaments de la fibra i les seves "fusions" (a partir d'ara Cablejat).

Transversalment l'eina té usuaris i projectes. Els projectes son conjunts d'Obra civil i cablejat que un usuari pot definir, i els usuaris tenen els seus propis projectes. Per tant els usuaris tenen projectes i els projectes son conjunts de "desplegaments".

Els projectes son d'un sol usuari i per tant no es poden veure per la resta d'usuaris.

## Obra civil

L'obra civil ens permet esquematitzar els elements físic, hi ha dos grans blocs:

* Lloc
* Tram

### Lloc

Els llocs son punts físic on es poden ubicar "caixes", cada caixa té com a característiques la posició (latitud i longitud), l'estat, tipus i Observacions.

N'hi ha de set tipus:

* Arquetes
* Pòsters
* Cambres
* Armaris
* POE
* Ganxo
* Salt: Es un cas especial, que ha de servir per ajuntar dos trams que son de tipus diferent, per exemple façana i aeri.


### Tram

Els trams son camins entre dos llocs. Les seves característiques son lloc inicial, lloc final, punts d'aquell tram, tipus i Observacions.

Un tram potser dels següents tipus:

* Aeri
* Façana
* Soterrat


## Cablejat

El Cablejat és el conjunt de fibres, "caixes" i fusions que fem en el desplegament.

* Caixes
* Fibres
* Fusions

El cablejat està molt relacionat amb l'Obra civil i per això una "caixa" s'ha de posar en un "Lloc" i una fibra passa per diferents Trams.

Les fusions només estan relacionades amb les caixes que hi ha dos o més fibres que arribin a aquest punt.

### Caixes

Les caixes son els espais físic on poden haver-hi fusion, també podem incloure aquell maquinari com splitters, etc...

### Fibres

Les fibres van d'una caixa a un altre. Quan les dibuixes has de començar per una caixa, anar passant per tots els llocs que passarà la fibra fins arribar a un altre caixa, s'han de fer dos clic a l'última caixa per què el sistema entengui que s'acaba allí aquella fibra.

### Fusions

Direm de les diferents fibres amb qui es solda i el sistema ens generà un esquema de com està fusionada aquella caixa.


## Sobre el programari

Per veure la demo podeu anar a : http://demo.fiberfy.io utilitzeu l'usuari "demo" i clau "demo"

Bugs i Noves funcionalitat: https://github.com/agustim/fiberfy-server/issues

Tot el codi font està a: https://github.com/agustim/fiberfy-server
