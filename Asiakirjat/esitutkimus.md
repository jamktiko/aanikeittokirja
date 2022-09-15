# Esitutkimus 0.6.1

- [Esitutkimus](#esitutkimus)
  - [Projektin tiedot](#projektin-tiedot)
    - [Termit ja lyhenteet](#termit-ja-lyhenteet)
    - [Viitteet](#viitteet)
  - [Johdanto](#johdanto)
  - [Visio](#visio)
  - [Käyttäjäkertomukset](#k%C3%A4ytt%C3%A4j%C3%A4kertomukset)
  - [Tekniset vaatimukset](#tekniset-vaatimukset)
  - [Ratkaisuvaihtoehdot](#ratkaisuvaihtoehdot)
    - [Ratkaisuvaihtoehto 1](#ratkaisuvaihtoehto-1)
      - [Toteutusympäristö](#toteutusymp%C3%A4rist%C3%B6)
      - [Toteutettavat kertomukset](#toteutettavat-kertomukset)
      - [Työmääräarviot](#ty%C3%B6m%C3%A4%C3%A4r%C3%A4arviot)
      - [Pros and Cons](#pros-and-cons)
  - [Yhteenveto](#yhteenveto)

## Projektin tiedot

Työnimi: Reseptipankki (ent. Äänikeittokirja)

Tekijät: Ville Kuusela, Toni Hiidenvuo, Ilmari Metsävainio, Toni Luomala

Visiomme on luoda yksinkertainen sovellusmuotoinen ratkaisu tallettaa kaikki suosikkireseptit yhteen paikkaan.

### Termit ja lyhenteet

_Esimerkiksi:_

| Termi | Kuvaus |
|---|---|
GIT | Versionhallintajärjestelmä
GitHub | Palvelu joka on rakennettu GIT versionhallinnan ympärille
Markdown | Merkkauskieli

### Viitteet

| Viittaus | Materiaali |
|---|---|
Projektisuunnitelma | https://github.com/jamktiko/reseptipankki/blob/main/Asiakirjat/projektisuunnitelma.md
HLTP | linkki tulossa

## Johdanto

Tämän dokumentin tarkoituksena on tuottaa esitutkimus Reseptipankki-sovellukselle. Kyseessä on mobiilisovellus, johon on helppo kirjoittaa, kopioida ja skannata reseptejä. Yksi sovelluksen ominaisuuksista on reseptien ääniohjaus; sovellus lukee niitä ääneen text-to-speech -teknologialla, ja käyttäjä pystyy ohjaamaan reseptin lukemisen etenemistä äänikomennoilla.

Esitutkimuksessa käydään läpi sovelluksen käyttäjäkertomukset, tekniset vaatimukset ja erilaiset ratkaisuvaihtoehdot.

## Visio

Sovelluksemme tarjoaa vaivattoman ja uniikin tavan tuoda reseptit jokaisesta lähteestä yhteen paikkaan. Nettisivujen reseptit voidaan helposti kopioida, fyysisessä muodossa olevat reseptit voidaan skannata ja päästä löytyvät uudet reseptit voidaan lisätä manuaalisesti intuitiivisella tavalla. 

"Kaikkien reseptien uusi koti"

## Käyttäjäkertomukset

1. Käyttäjä haluaa lisätä fyysisen keittokirjastansa reseptin sovellukseen. Hyväksymiskriteeri: Käyttäjä voi ottaa sovelluksessa kuvan reseptistä, ja tätä kautta lisätä sen omiin resepteihinsä.
2. Käyttäjä haluaa lisätä netistä löytämänsä reseptin sovellukseen. Hyväksymiskriteeri: Käyttäjä voi liittää reseptin url-osoitteen sovellukseen, ja sovellus ja hakee reseptin sivulta ja laittaa sen oikeaan muotoon.
3. Käyttäjä haluaa kirjoittaa juuri itse keksimänsä reseptin sovellukseen. Hyväksymiskriteeri: Käyttäjä voi kirjoittaa reseptinsä nimen, ainekset ja vaiheet sovelluksessa manuaalisesti ja lisätä reseptin siten.
4. Käyttäjä haluaa luoda listan, johon hän voi tallettaa tietyn kategorian reseptit. Hyväksymiskriteeri: Listan luominen onnistuu, ja sille voidaan lisätä reseptejä.
5. Käyttäjä haluaa muokata luomaansa listaa tai poistaa sen. Hyväksymiskriteeri: Listoilla on muokkausnäkymä, josta niitä voi muokata tai poistaa.
6. Käyttäjä haluaa muokata luomaansa reseptiä tai poistaa sen. Hyväksymiskriteeri: Resepteillä on muokkausnäkymä, josta niitä voi muokata tai poistaa.
7. Erikoisruokavaliota noudattava käyttäjä ei halua, että sovelluksensa etusivulla hänelle suositellaan liharuokia. Hyväksymiskriteeri: Käyttäjä voi sovelluksen asetuksissa asettaa erikoisruokavalionsa, jolloin hänen erikoisruokavalioonsa kuulumattomia reseptejä ei enää suositella hänelle.
8. Käyttäjä haluaa käyttää ääniominaisuuksia ruokaa laittaessaan. Hyväksymiskriteeri: Äänentunnistus tunnistaa ja ymmärtää käyttäjän sanat ruoanlaiton taustaäänien seasta, ja sovellus lukee reseptin kohtia käyttäjän komentojen mukaan.

## Tekniset vaatimukset

_Lista projektin teknisistä vaatimuksista_

Esimerkiksi:

1. Applikaation/sivuston tulee käyttää TLS/SLS salausta
2. Pelin tulee toimi sulavasti (>60fps) Samsung Galaxy S2 puhelimella

## Ratkaisuvaihtoehdot

_Listaa niin monta ratkaisuvaihtoehtoa kuin niitä tulee ilmi_

### Ratkaisuvaihtoehto 1

#### Toteutusympäristö

_Tässä aliluvussa kerrotaan ympäristön jossa tietojärjestelmä tulee toimimaan. Tähän kannattaa liittää myös yksinkertainen arkkitehtuurikuva, josta pystytään havainnoimaan järjestelmän oleelliset osat ja osien välinen kommunikointi_

#### Toteutettavat kertomukset

_Tässä aliluvussa kerrotaan mitä kertomuksia kyseisellä tekniikalla pystytään toteuttamaan ja mitä ei_

#### Työmääräarviot

_Tähän arvioidaan hyvin karkealla tasolla työhön kuluva aika. Tehkää arviot käyttäen hyväksi seurantaraportin Työmäärien arviointi -välilehteä (SeurantaRaportti_Projektin_nimi.xls). Työmäärien arvioinnissa jokainen projektin jäsen tekee omat arvionsa ja sen jälkeen keskustellaan arviot läpi, jolloin päätetään vaiheeseen arvioitavat tunnit._

_Esimerkiksi_>
| Vaihe | Tunnit | Muuta?
|---|---|---|
Käynnistys | 10 | Jee
Suunnittelu | 10 | Jee
**Yht** | 20 | Paljon tunteja

#### Pros and Cons

_Tässä aliluvussa kerrotaan ratkaisuvaihtoehdon hyvät ja huonot puolet objektiivisesti_

## Yhteenveto

_Tässä luvussa tehdään ehdotus järjestelmän toteutustavasta (siis jokin edellä esitellyistä vaihtoehdoista) ja perustellaan ko. valinta._
