# FWK23S_SKI_Auth

- innan start. installera: (npm install)

- Våra lösenord, portnummer och den hemliga nycken ligger i en .env fil som dolts i gitignore. Lösenorden är hashade av säkerhetskäl.

- Vi har skapat möjligheten för att endast admin ska ha tillgång till hemlig data på hemsidan. Annars kommer det upp ett felmeddelande (403)

##   Sign JWT
Auth server utfärder JWT med SECRET_KEY

##   JWT token expiration time
Admin kan stanna på hemsidan i en timme innan man loggas ut.
alla andra kan bara stanna i 30 sekunder. 

##   users.json
Vi har använt en .json fil för att skapa vår fejkade databas där alla användare och lösenord finns. De döljas i vår .env fil (inga lösenord eller användarnan står i klartext i vår databas)

##   Saltade lösenord
Vi har installerat bcrypt som är en krypteringsalgoritm som används för att kryptera lösenord. Den genererar en slumpmässig sträng (salt) som läggs till lösenordet innan krypteringen utförs.
("Saltade lösenord"). Användningen av saltning i bcrypt är effektivt mot rainbow table-attacker.

##   Helmet
Vi har installerat helmet och använt det i vår server.js för att undvika attacker så som cross site scripting tex (xss) osv.

##  Hur server kommunicerar varandra med JWT
1. Frontend skickar credential (e-mail, lösenord) till Auth 
2. Auth kollar på inlogning uppgifter i users.json.Loggin Lyckas.
3. Auth utfäder JWT med SECRET_KEY och skicka de till Frontend
4. Frontend spara JWT i LocalStrage.
5. Skicka request med JWT i header till Backend -> headers: { Authorization: `Bearer ${token}` }
6. Backend verify JWT och
7. Backend kollar på rollen, admin eller user i payload
8. Backend skickar respons till Frontend 




