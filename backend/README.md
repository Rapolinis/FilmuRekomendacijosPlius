# Filmų Rekomendacijos +

## Paleidimas po `git pull`

### 1. Įsidiegti

Reikia turėti:

- Node.js
- .NET SDK 9
- MySQL Server
- MySQL Workbench

---

## 2. Sukurti duomenų bazę

Atsidarykite MySQL Workbench ir paleiskite SQL failą:

```text
backend/schema.sql

Turi atsirasti duomenų bazė:

filmudb
3. Susikurti backend config failą

Backend aplanke sukurkite failą:

backend/appsettings.Development.json

Į jį įklijuokite:

{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=filmudb;User ID=root;Password=JUSU_MYSQL_SLAPTAZODIS;"
  }
}

JUSU_MYSQL_SLAPTAZODIS pakeiskite į savo MySQL root slaptažodį.

Jeigu MySQL neturi slaptažodžio:

"DefaultConnection": "Server=localhost;Database=filmudb;User ID=root;Password=;"
4. Paleisti backend

Terminale:

cd backend
dotnet restore
dotnet run

Backend turi pasileisti ant:

http://localhost:5075

Patikrinimas naršyklėje:

http://localhost:5075/api/movies

Jeigu matote JSON filmų sąrašą — backend veikia.

5. Paleisti frontend

Kitame terminale iš projekto root folderio:

npm install
npm run dev

Frontend veiks ant Vite adreso, pvz.:

http://localhost:5173
Projekto struktūra
backend/
  Controllers/
  Models/
  Program.cs
  appsettings.json
  appsettings.Development.json   <- susikurti patiems, nepushinti
  schema.sql

src/
  components/
  context/
  pages/
Svarbu

appsettings.Development.json nėra pushinamas į Git, nes ten yra asmeninis MySQL slaptažodis.

Jeigu duomenys nerodomi:

Patikrinkite ar veikia MySQL.
Patikrinkite ar sukurta filmudb.
Patikrinkite ar teisingas slaptažodis appsettings.Development.json.

Patikrinkite ar backend veikia:

http://localhost:5075/api/movies

Patikrinkite ar frontend naudoja:

http://localhost:5075