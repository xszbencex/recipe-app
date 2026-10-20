# Recept Archívum Webapp - Projekt Kontextus & Architektúra

## 1. Projekt Áttekintés

Egy modern, letisztult, editorial/magazin stílusú személyes receptkezelő webalkalmazás. Az alkalmazás célja, hogy a felhasználó gyorsan eltárolhassa, kereshesse és rendszerezhesse a saját receptjeit, valamint képekből (pl. szakácskönyv fotó) automatikus AI/OCR alapon receptet generálhasson.

## 2. Tech Stack & Technológiák

- **Frontend Framework:** Angular (v18+ Standalone komponensek, Signals, Control Flow syntax: `@if`, `@for`)
- **Styling & UI:** Tailwind CSS + DaisyUI (Warm/editorial téma, serif és sans-serif tipográfia hibrid használatával)
- **Icon Pack:** Lucide Icons (`lucide-angular`) – vékony, outline stílusú ikonok
- **Backend & Adatbázis:** Firebase Cloud Firestore (NoSQL)
- **Autentikáció:** Firebase Auth (Email/Jelszó alapú bejelentkezés)
- **AI / OCR:** Google Gemini API (Gemini Flash Vision) – Képből strukturált JSON recept generálása ingyenes tier-en
- **Hoszting:** Vercel (Hobby csomag)

## 3. Adatmodell & Firestore Strukturálás

### Collection: `recipes`

Minden recept a `recipes` gyűjteményben tárolódik önálló dokumentumként.

```typescript
export interface Recipe {
  id?: string;
  authorId: string; // Firebase Auth UID (tulajdonos)
  title: string;
  description: string;
  category: string; // Pl. "Vacsora", "Ebéd", "Desszert"
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  ingredients: string[];
  steps: string[];
  createdAt: Timestamp;
}
```

## 4. Biztonság & Firebase Security Rules

A Firestore biztonsági szabályai biztosítják, hogy minden felhasználó kizárólag a saját adataihoz férhessen hozzá:

```firestore
service cloud.firestore {
  match /databases/{database}/documents {
    match /recipes/{document} {
      allow read, delete: if request.auth.uid == resource.data.authorId;
      allow create: if request.auth.uid == request.resource.data.authorId;
      allow update: if request.auth.uid == request.resource.data.authorId
                    && request.auth.uid == resource.data.authorId;
    }
  }
}
```

## 5. Alkalmazás Inicializálás & Auth Kezelés

- **`APP_INITIALIZER`:** Az Angular alkalmazás indulásakor az `APP_INITIALIZER` segítségével megvárjuk a Firebase Auth inicializálódását (`onAuthStateChanged`). Így a lap frissítésekor sincs üres vagy hiányos állapot.
- **`AuthService`:** Signals segítségével tárolja a `currentUser` és `loading` állapotot.
- **`RecipeService`:**
  - Minden lekérdezés tartalmazza a `where('authorId', '==', user.uid)` szűrőt a Security Rules elvárásainak megfelelően.
  - Saját kereső- és szűrőlogikát tartalmaz (kategória, nehézség, név szerinti keresés).

## 6. Jövőbeli / Tervezett Funkciók

1.  **AI OCR Recept Import:** Kép feltöltése -> Gemini Vision API -> Automatikus JSON válasz -> Új recept form előkitöltése.
2.  **Recept Kártya & Részletek:** Részletes recept nézet, hozzávalók és lépések interaktív pipálásával.
3.  **Keresés & Szűrés:** Dynamic Angular Signals alapú kliensoldali szűrés.
