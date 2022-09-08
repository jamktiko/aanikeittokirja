# Projektisuunnitelma

## Projektin tiedot

**Työnimi:**
Äänikeittokirja

**Tekijät:**
Ville Kuusela,
Toni Hiidenvuo,
Ilmari Metsävainio,
Heta Lautiainen,
Toni Luomala

## Termit ja lyhenteet
| Termi | Kuvaus |
|---|---|
Git | Versionhallintajärjestelmä
GitHub | Palvelu joka on rakennettu GIT-versionhallinnan ympärille
Markdown | Merkkauskieli
HTML| Merkintäkieli jolla kirjoitetaan internetsivuja
CSS| Merkintäkieli jolla määritellään ulkoasu HTML-sivuille
Sivusto| Internet-sivu
Sovellus| Tietokoneohjelma
Mobiililaite| Puhelin tai tabletti
Frontend| Käyttäjälle näkyvä osa sivustosta tai sovelluksesta
Backend| Palvelin, vastaa tietojen tallentamisesta tai käsittelystä
PWA| Mobiililaitteen selaimessa toimiva sovellus
Text-to-speech| Teknologia joka lukee annetun tekstin ääneen
JavaScript| Frontend-ohjelmointikieli
Kirjasto| Kokoelma valmiiksi kirjoitettua koodia
Framework| Ohjelmistokehys joka antaa rungon sovelluksen tai sivuston kehittämiseen
React| JavaScript-kirjasto, voidaan mieltää myös frameworkiksi
NodeJS| Teknologia JavaScript-koodin suorittamiseen palvelimella (backendissä)
Express.js| NodeJS-framework
Tietokanta| Kooste johon sivuston tai sovelluksen käyttämä tieto tallennetaan
SQL| Kyselykieli tietokannalle
MySQL | Relaatiotietokantaohjelmisto
MySQL Workbench | Visuaalinen tietokannan suunnittelu/hallintatyökalu
ERDPlus | Tietokantojen mallinnustyökalu
Amazon RDS | Amazonin ylläpitämä relaatiotietokantapalvelu

## Viitteet

## Projektin sisältö

### Johdanto

Projektimme työnimenä on toistaiseksi Äänikeittokirja. Kyseessä on nettisivu ja mobiilisovellus, johon on helppo kirjoittaa, kopioida, skannata reseptejä. Yksi sovelluksen pääominaisuuksista on reseptien ääniohjaus; sovellus lukee niitä ääneen text-to-speech -teknologialla, ja käyttäjä pystyy ohjaamaan reseptin lukemisen etenemistä äänikomennoilla.

Tässä dokumentissa on kuvattuna tiimimme suunnitelma projektin etenemiseen ja tiimimme työntekoon liittyen.

### Projektin tausta ja tavoitteet

Sovellus on tarkoitettu kaikille, jotka haluavat käyttää reseptejä ruokaa laittaessaan ja omistavat tietokoneen tai älylaitteen.

Projektin tavoitteena on luoda sovellus, johon saa helposti koottua kaikki haluamansa reseptit sekä nettisivuilta että fyysisistä keittokirjoista, sekä avustaa ruoanlaitossa ääniohjauksensa avulla.

### Tuotokset

- Projektisuunnitelma
- Esitutkimus
- Sprint backlog
- Product backlog
- High level test plan
- Markkinointidokumentaatio
- Versiodokumentaatio
- Lopullinen sovellus

### Projektin hyväksyminen

Hyväksymiseen vaadittavat toiminnot:

- Sovellus lukee valittua reseptiä ääneen vaihe kerrallaan
- Sovellus ymmärtää käyttäjän äänikomennot "aloita", "seuraava" ja "toista"
- Sovellukseen pystyy lisäämään reseptejä (tietokantaan) sovelluksen lomakkeella. Reseptit ovat joko yksityisiä tai julkisia
- Reseptien lisääminen onnistuu myös kopioimalla niitä nettisivuilta, ja ne formatoituvat sovelluksemme vaatimaan muotoon
- Reseptien lisääminen onnistuu fyysisestä keittokirjasta skannaten käyttäen mobiililaitteen kameraa. Ne formatoituvat sovelluksemme vaatimaan muotoon
- Julkisia ja käyttäjän omia reseptejä pystyy selaamaan, hakemaan ja avaamaan
- Sovellukseen pystyy luomaan käyttäjätunnuksen, sekä kirjautumaan sisään ja ulos

## Toimintasuunnitelma

### Projektin aloittamisesta

### Projektin toteuttamisesta

### Projektin testaamisesta

### Projektin lopettamisesta

## Projektin resurssit

### Projektin organisaatio
|Nimi|Roolit|Yhteystiedot|
|--| --| --|
| Ilmari Metsävainio | Tekniikka |AA3216@student.jamk.fi	|
|Ville Kuusela|Rooli|sposti
|Toni Hiidenvuo|Rooli|Sposti
|Toni Luomala|Rooli|Sposti
|Heta Lautiainen|Rooli|Sposti

### Ohjausryhmä

### Työkalut

- Amazon RDS
- MySQL workbench
-	VSCode
-	React
-	GitHub
-	ERDPlus

## Raportointi ja kommunikointi

### Sisäinen raportointi
#### Scrum Master
- Viikottainen yleisluontoinen raportti projektin edistymisestä
- Viikottainen raportti Scrum-palavereista
- Viikottainen raportti muista palavereista
- Sprintin päätösraportti
- Koko projektin päätösraportti

### Asiakasraportointi

### Palaverikäytänteet

### Kommunikointitavat
- Discord
- WhatsApp

## Dokumentointi

### Dokumenttipohjat

### Dokumenttien hallinta

Dokumentit säilytetään projektin Github-repositorion Asiakirjat -hakemistossa. Kaikilla tiimin jäsenillä on oikeudet kaikkiin asiakirjoihin.

Dokumenttien kirjoittajat pitävän dokumentin backupia säilössä omassa OneDrivessaan varmistaakseen sen säilymisen.

Versiointi toteutetaan major.minor.patch -tavalla. Dokumenttitiedostojen nimet kirjoitetaan pienin kirjaimin ja versio lisätään perään alaviivan ja v-kirjaimen jälkeen. Esimerkki: dokumentti_v0_3_5.md, tarkoittaa versiota 0.3.5.

## Riskien hallinta

## Avoimet asiat
|Riski|Todennäköisyys|Vaikutus|Ratkaisu|
|--| --| --| --|
| Motivaation puute/Väsymys | Suuri | Suuri | Lomapäivä, Ryhmässä ongelman ratkominen |
| GitHub serveri ongelma | Pieni | Suuri | Paikallisten versioiden käyttö |
| Sairastapaukset | keskisuuri | keskisuuri | Työtehtvien uudelleen jakaminen väliaikaisesti |
