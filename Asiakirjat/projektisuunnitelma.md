# Projektisuunnitelma 1.2.1

## Projektin tiedot

**Työnimi:**
Reseptipankki (ent. Äänikeittokirja)

**Tekijät:**
Ville Kuusela,
Toni Hiidenvuo,
Ilmari Metsävainio,
Toni Luomala

## Termit ja lyhenteet
| Termi | Kuvaus |
|---|---|
Git | Versionhallintajärjestelmä
GitHub | Palvelu joka on rakennettu GIT-versionhallinnan ympärille
Frontend| Käyttäjälle näkyvä osa sivustosta tai sovelluksesta
Backend| Palvelin, vastaa tietojen tallentamisesta tai käsittelystä
Text-to-speech| Teknologia joka lukee annetun tekstin ääneen
JavaScript| Frontend-ohjelmointikieli
Kirjasto| Kokoelma valmiiksi kirjoitettua koodia
Framework| Ohjelmistokehys joka antaa rungon sovelluksen tai sivuston kehittämiseen
SQL| Kyselykieli tietokannalle
MySQL | Relaatiotietokantaohjelmisto
MySQL Workbench | Visuaalinen tietokannan suunnittelu-/hallintatyökalu
ERDPlus | Tietokantojen mallinnustyökalu
Amazon RDS | Amazonin ylläpitämä relaatiotietokantapalvelu
Amazon S3 | Amazonin ylläpitämä objektipohjainen tallennuspalvelu

## Viitteet

| Viittaus | Materiaali |
|---|---|
Esitutkimus | https://github.com/jamktiko/reseptipankki/edit/main/Asiakirjat/esitutkimus.md
Design Sprint -raportti | https://github.com/jamktiko/reseptipankki/blob/main/Asiakirjat/design-sprint.md
HLTP | Linkki tulossa

## Projektin sisältö

### Johdanto

Projektimme työnimenä on toistaiseksi Reseptipankki. Kyseessä on mobiilisovellus, johon on helppo kirjoittaa, tuoda ja skannata reseptejä. Yksi sovelluksen ominaisuuksista on reseptien ääniohjaus; sovellus lukee niitä ääneen text-to-speech-teknologialla, ja käyttäjä pystyy ohjaamaan reseptin lukemisen etenemistä äänikomennoilla.

Tässä dokumentissa on kuvattuna tiimimme suunnitelma projektin etenemiseen ja tiimimme työntekoon liittyen.

### Projektin tausta ja tavoitteet

Sovellus on tarkoitettu kaikille, jotka haluavat tallentaa ruokaohjeita omaan käyttöönsä.

Projektin tavoitteena on luoda sovellus, johon saa helposti koottua kaikki haluamansa reseptit sekä nettisivuilta että fyysisistä keittokirjoista, sekä avustaa ruoanlaitossa ääniohjauksensa avulla.

### Tuotokset

- Projektisuunnitelma
- Esitutkimus
- Sprint backlog
- Product backlog
- High level test plan
- Google Design Sprint -dokumentaatio
- Markkinointidokumentaatio
- Versiodokumentaatio
- Lopullinen sovellus

### Projektin hyväksyminen

Hyväksymiseen vaadittavat toiminnot:

- Sovellus lukee valittua reseptiä ääneen vaihe kerrallaan
- Sovellus ymmärtää käyttäjän äänikomennot esim. "aloita", "seuraava" ja "toista"
- Sovellukseen pystyy lisäämään reseptejä (tietokantaan) sovelluksen lomakkeella. Reseptit ovat joko yksityisiä tai julkisia
- Reseptien lisääminen onnistuu myös suoran linkin avulla toiselta nettisivulta, ja ne formatoituvat sovelluksemme vaatimaan muotoon
- Reseptien lisääminen onnistuu fyysisestä keittokirjasta skannaten käyttäen mobiililaitteen kameraa. Ne formatoituvat sovelluksemme vaatimaan muotoon
- Julkisia ja käyttäjän omia reseptejä pystyy selaamaan, hakemaan ja avaamaan
- Sovellukseen pystyy luomaan käyttäjätunnuksen, sekä kirjautumaan sisään ja ulos

## Toimintasuunnitelma

### Projektin aloittamisesta

Projektisuunnitelman valmistuttua siirrymme suorittamaan Design Sprintiä, jonka aikana luomme testatun prototyypin sovelluksestamme sekä pyrimme löytämään sen suunnan, johon projektia tullaan viemään eteenpäin. Kun Design Sprint on suoritettu onnistuneesti ja myös esitutkimus on valmis, siirrymme projektin varsinaiseen tuotantovaiheeseen.

### Projektin toteuttamisesta

Projektin tuotannossa ja hallinassa käytössämme on Scrum -viitekehys, johon sisältyviä toimintatapoja noudatamme.

Pyrimme tuotannossa ottamaan huomioon kestävän ohjelmistokehityksen parhaiden kykyjemme mukaan. Sovellusta luodessamme pyrimme luomaan tehokasta ja uudelleenkäytettävää koodia, joka toimii vielä pitkän ajan päästäkin. Näin luomastamme järjestelmästä saadaan kestävä niin ekologisesti kuin taloudellisestikin. 

Pyrimme myös ottamaan huomioon sovelluskehittämisen yhteiskunnallisen vastuun; ylläpidämme sosiaalista ja kulttuurista pääomaa kannustamalla loppukäyttäjiä kokeilemaan vieraiden kulttuurien keittiöiden antimia.

Projektin aikana tulemme tiimimme businessvastaavan johdolla käsittelemään myös sovelluksen kehittämistä liiketoiminnan näkökulmasta.

Kaiken tämän edellä projektin tärkein tavoite on oppiminen, joten pyrimme sisäistämään sen aikana käyttämämme toimintatavat siten, että niistä olisi meille hyötyä myös tulevaisuudessa.

### Projektin testaamisesta

Tulemme tuotannon aikana varmistamaan sovelluksen toimivuuden luomalla toimivia testejä. Näiden lisäksi tulemme sekä prototyypin että varsinaisen sovelluksen toiminnallisuuksien kehittyessä testaamaan sovellusta mahdollisilla loppukäyttäjillä ja kuuntelemaan heiltä saatavaa arvokasta palautetta.

Lisätietoa projektissamme käytettävistä testausmenetelmistä löytyy projektimme HLTP-dokumentista.

### Projektin lopettamisesta

Projektimme voidaan todeta valmiiksi, kun sovelluksessamme vaaditut toiminnallisuudet (ks. Hyväksymiseen vaadittavat toiminnot) on testattu toimiviksi (hyväksymistestaus) ja ohjelmistovaatimukset täyttäviksi, ja liiketoiminnan suunnitelmat ovat selkeät sekä uskottavan toimivat.

## Projektin resurssit

### Projektin organisaatio
|Nimi|Roolit|Yhteystiedot|
|--| --| --|
|Ilmari Metsävainio| Tekniikka, Q&A |AA3216@student.jamk.fi	|
|Ville Kuusela| Tekniikka, Product Owner, UI/UX |AA2338@student.jamk.fi
|Toni Hiidenvuo|Tekniikka, Scrum Master|AA3689@student.jamk.fi
|Toni Luomala|Tekniikka, Business|AA4498@student.jamk.fi

### Ohjausryhmä
|Nimi|Roolit|Yhteystiedot|
|--| --| --|
| Teemu Pölkki | Vastuuopettaja | teemu.polkki@jamk.fi	|
| Antony Smal| Liiketoimintatiimi | antony.smal@jamk.fi
| Jukka Riikonen | PO, SM tiimit | jukka.riikonen@jamk.fi
| Jere Lamberg | QA tiimi | jere.lamberg@jamk.fi

### Työkalut

- Amazon RDS
- Amazon S3
- MySQL workbench
-	VSCode
-	Git
-	GitHub
-	ERDPlus
-	Cypress

## Raportointi ja kommunikointi

### Sisäinen raportointi
#### Scrum Master
- Viikottainen yleisluontoinen raportti projektin edistymisestä
- Viikottainen raportti Scrum-palavereista
- Viikottainen raportti muista palavereista
- Sprintin päätösraportti
- Koko projektin päätösraportti

### Palaverikäytänteet

Pidämme Daily Scrumit toimistossamme päivittäin työpäivän ensimmäisenä tehtävänä. Tiistaisin Daily Scrumin ajankohta on noin klo 13, muina päivinä esituotannon aikana noin klo 9 ja tuotantovaiheen käynnistyttyä todennäköisesti noin klo 10.
Viikkopalaverit ovat viikon viimeinen homma, ne pidetään perjantaina noin klo 15:15.

### Kommunikointitavat
- Discord
- WhatsApp

## Dokumentointi

### Dokumenttien hallinta

Dokumentit säilytetään projektin Github-repositorion Asiakirjat-hakemistossa. Kaikilla tiimin jäsenillä on oikeudet kaikkiin asiakirjoihin.

Dokumenttien kirjoittajat pitävän dokumentin backupia säilössä omassa OneDrivessaan varmistaakseen sen säilymisen.

Versiointi toteutetaan major.minor.patch-tavalla. Dokumenttitiedostojen nimessä ei ole versionumeroa linkityssyistä. Versio merkataan dokumentin otsikon perään, esim. Projektisuunnitelma 1.0.0

## Riskien hallinta
|Riski|Todennäköisyys|Vaikutus|Ratkaisu|
|--| --| --| --|
| Työaikojen noudattamatta jättäminen | Pieni | Keskisuuri | Asiasta keskusteleminen, työaikojen muuttaminen? |
| Motivaation puute/Väsymys | Suuri | Suuri | Ryhmässä ongelman ratkominen, lomapäivä |
| Sairastapaukset | Keskisuuri | Keskisuuri | Työtehtävien uudelleen jakaminen väliaikaisesti |
| Huono kommunikaatio | Suuri | Suuri | Asian esillenosto ensin kyseisen henkilön kanssa, jatkuessa ylemmälle taholle |
| GitHubin serveriongelma | Pieni | Suuri | Paikallisten versioiden käyttö |
| Reseptien ääneenlukeminen on UX-näkökulmasta todella vaikea tehdä sujuvaksi ja oikeasti hyödylliseksi | Suuri | Keskisuuri | Mietitään uudestaan mitä haluamme kyseiseltä ominaisuudelta; alennamme ominaisuuden "pieneksi sivuominaisuudeksi" pääominaisuuden sijaan |
| Reseptien skannaaminen kuvista ei toimi halutulla tavalla | Pieni | Suuri | Yritetään saada toimimaan, jos ei saada niin harkitaan ominaisuuden hylkäämistä |
| Sovelluksen kehitys ei pysy aikataulussaan | Keskisuuri | Keskisuuri | Aloitus tärkeimmistä ominaisuuksista, hyväksymiskriteerien muokkaus eli ominaisuuden tms. pois jättäminen |

## Avoimet asiat
Ei avoimia asioita.
