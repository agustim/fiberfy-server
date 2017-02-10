# Cobertura

## Nova Capa

S'ha plantejat crear una nova capa "Cobertura", on hi hagui totes les adreces amb numero, i es faci una fitxa amb:

* Poble
* Carrer
* Número
* Cobertura
* Previsió
* Operador
* Xarxa
* Posició (Lat/Lon)

## Bitacora

### 2017/02/08

En Marc Mundó ens planteja afegir una capa a l'eina de fibra per posar la cobertura.

Ell penteja mirar de migrar tots els carrers/numeros/poblacions per tal de tenir una fitxa amb possible cobertura d'aquell lloc.

Ell via myapps + diputacio de barcelona (http://sitmun.diba.cat/sitmun2/inicio.jsp) penteja migrar les @. I després mirar d'exportar-ho al sistema.


### 2017/02/10

Després d'investigar diferents vies, veiem que:

* El sistema del Marc NO exporta les posicions el punt (KML), i per tant NO ens serviex. :-(
* Via Diputació de Barcelona només hi ha els municipis de la provincia de Barcelona sense la ciutat de Barcelona. Per recuperar la resta de carrers i números, de moment no s'ha trobat la forma de fer-ho.
* Via api de google o via api de OpenStreetMap, podem aconseguir d'un carrer-numero-ciutat.
* Via Alaitz, m'arriba la informació que el icc també té una eina.

#### Exemple:

Avinguda de la Ribera, 1 Gurb

* Google API: https://maps.googleapis.com/maps/api/geocode/json?address=Avinguda+de+la+Ribera+1+Gurb
* Opens Street Map API: https://nominatim.openstreetmap.org/?format=json&q=Avinguda+de+la+Ribera+1+Gurb
* ICC:
http://dataspellfarm.icc.cat/mic1.php?Q=Avinguda+de+la+Ribera+1+Gurb
