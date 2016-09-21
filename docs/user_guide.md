# fiberfy

## Manual d'Usuari

L'objectiu principal de l'eina és posicionar en el mapa, tant la distribució física dels elements d'intraestructura per a la xarxa de fibra òptica (a partir d'ara Obra civil), com els desplegaments de la fibra i les seves "fusions" (a partir d'ara Cablejat).

Transversalment, l'eina té usuaris i projectes. Els projectes són conjunts d'Obra civil i Cablejat que un usuari pot definir. Els usuaris tenen els seus propis projectes. Per tant, els usuaris tenen projectes i els projectes són conjunts de "desplegaments" de Cablejat ubicat en Obra civil.

Els projectes són d'un sol usuari i, per tant, un projecte no és visible per la resta d'usuaris.

## Obra civil

L'obra civil ens permet esquematitzar els elements físic, hi ha dos grans blocs:

* Llocs
* Trams

### Llocs

Els llocs són punts físics on es poden ubicar "caixes", cada caixa té com a característiques: posició (latitud i longitud), estat, tipus i observacions.

N'hi ha de set tipus:

* Arquetes
* Postes
* Cambres
* Armaris
* POE (transicions entre trams soterrats i façanes o postes, típicament són tubs metàl·lics verticals)
* Ganxo
* Salt (és un cas especial, que ha de servir per ajuntar dos trams que són de tipus diferent, per exemple: façana i aeri)


### Trams

Els trams són camins entre dos llocs. Les seves característiques són: lloc inicial, lloc final, punts intermitjos del tram, tipus i observacions.

Un tram potser dels següents tipus:

* Aeri
* Façana
* Soterrat


## Cablejat

El cablejat és el conjunt de: fibres (ubicades dins dels cables), "caixes" i fusions. Aquests elements formen el desplegament.

* Caixes
* Fibres
* Fusions

El cablejat està directament relacionat amb l'Obra civil i, per això, una "Caixa" s'ubica en un "Lloc" i una fibra passa per un o més "Trams".

Les fusions estan relacionades amb les caixes sempre que hi hagi dues o més fibres que arribin a aquest punt, a la caixa.

### Caixes

Les caixes són els espais físics on poden haver-hi fusions, també hi pot haver altres elements: splitters, etc...

### Fibres

Les fibres van d'una caixa a una altra. Quan es dibuixen cal començar per una caixa, anar marcant tots els llocs que passarà la fibra fins arribar a una altra caixa. Cal fer dos clic a l'última caixa perquè el sistema entengui que s'acaba allí aquella fibra.

### Fusions

S'identifiquen les diferents fibres que es solden. El sistema genera un esquema de com estan fusionades les fibres a la caixa.


## Sobre el programari

Per veure una demo podeu anar a : http://demo.fiberfy.io utilitzeu l'usuari "demo" i clau "demo"

Bugs i Noves funcionalitat: https://github.com/agustim/fiberfy-server/issues

Tot el codi font està a: https://github.com/agustim/fiberfy-server
