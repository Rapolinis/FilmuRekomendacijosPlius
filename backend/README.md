# Filmų Rekomendacijos +

Filmų rekomendavimo sistema su React, ASP.NET Core ir MySQL.

---

# Reikalavimai

Prieš paleidžiant projektą reikia turėti įdiegtus:

- Node.js
- .NET SDK 9
- MySQL Server
- MySQL Workbench
Kuriantis workbencha nepamirskit savo passwordo
---

# Projekto paleidimas

## 1. Klonuoti projektą

git clone https://github.com/Rapolinis/FilmuRekomendacijosPlius


## 2. Sukurti duomenų bazę

Atidarykite MySQL Workbench.

Pasirinkite:

File → Open SQL Script

Atidarykite failą:

backend/schema.sql

Nukopijuokit visą failą į Workbencho query scriptą.
Paleiskite visą scriptą paspaudę:

⚡ Execute

Bus automatiškai:

- sukurta `filmudb`
- sukurtos lentelės
- įkelti visi duomenys

---

## 3. Backend konfiguracija

Atidarykite failą:

backend/appsettings.Development.json

Pagal poreikį įrašykite savo MySQL slaptažodį:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },

  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=filmudb;User=root;Password=JUSU_PASSWORD;"
  }
}

## 4. Paleisti backend

Terminale:

cd backend
dotnet restore
dotnet run

Backend turi pasileisti ant:

http://localhost:5075

---

## 5. Paleisti frontend

Naujame terminale:

npm install
npm run dev


Jeigu neleidzia instaliuoti:
npm install vite --save-dev
ir tada vel:
npm install

Frontend adresas:
turite matyti
http://localhost:5173