# Node.js Express API Setup with Knex.js & Objection.js

## 1. Initialize Your Project

Mulai dengan membuat proyek baru:

```sh
mkdir my-app
cd my-app
npm init -y
```

Perintah ini akan membuat file `package.json`.

## 2. Install Dependencies

Instal dependensi yang diperlukan:

```sh
npm install express dotenv cors
```

Untuk ORM/Query Builder, kita menggunakan **Knex.js + Objection.js**:

```sh
npm install knex objection pg # Untuk PostgreSQL (gunakan `mysql2` jika menggunakan MySQL)
```

Jika ingin menggunakan `nodemon` untuk restart otomatis saat pengembangan:

```sh
npm install --save-dev nodemon
```

Tambahkan skrip berikut ke `package.json`:

```json
"scripts": {
  "dev": "nodemon server.js"
}
```

## 3. Set Up Express

Buat file `server.js`:

```js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

Jalankan server dengan:

```sh
npm run dev
```

## 4. Set Up Knex & Objection

### 4.1 Konfigurasi Knex

Inisialisasi Knex:

```sh
npx knex init
```

Ubah isi `knexfile.js`:

```js
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      user: "your_db_user",
      password: "your_db_password",
      database: "your_db_name",
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
```

### 4.2 Konfigurasi Objection.js

Buat file `db.js`:

```js
const Knex = require("knex");
const { Model } = require("objection");

const knexConfig = require("./knexfile");
const knex = Knex(knexConfig.development);

Model.knex(knex);

module.exports = knex;
```

## 5. Buat Model (Seperti Laravel Model)

Buat folder `models/` dan tambahkan `User.js`:

```js
const { Model } = require("objection");

class User extends Model {
  static get tableName() {
    return "users";
  }
}

module.exports = User;
```

## 6. Buat Migration (Seperti Laravel)

Buat file migration:

```sh
npx knex migrate:make create_users
```

Edit file migration yang dibuat (`migrations/YYYYMMDD_create_users.js`):

```js
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").unique().notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
```

Jalankan migration:

```sh
npx knex migrate:latest
```

## 7. Buat Controller

Buat folder `controllers/` dan tambahkan `userController.js`:

```js
const User = require("../models/User");

const getUsers = async (req, res) => {
  const users = await User.query();
  res.json(users);
};

const createUser = async (req, res) => {
  const { name, email } = req.body;
  const newUser = await User.query().insert({ name, email });
  res.json(newUser);
};

module.exports = { getUsers, createUser };
```

## 8. Buat Routes

Buat folder `routes/` dan tambahkan `userRoutes.js`:

```js
const express = require("express");
const { getUsers, createUser } = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);

module.exports = router;
```

## 9. Register Routes di Express

Modifikasi `server.js`:

```js
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
```

Sekarang, jalankan API dengan:

```sh
npm run dev
```

### Uji API dengan Endpoint:

- **Get Users**: `GET http://localhost:5000/api/users`
- **Create User**: `POST http://localhost:5000/api/users`

Contoh Body JSON untuk membuat user baru:

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

## 10. Next Steps

- **JWT Authentication**: Gunakan `jsonwebtoken` seperti Laravel Sanctum.
- **Validation**: Gunakan `express-validator`.
- **Frontend**: Gunakan React, Vue, atau framework lain untuk mengkonsumsi API.

---

Dokumentasi ini memberikan panduan lengkap untuk mengatur proyek Node.js dengan **Express**, **Knex.js**, dan **Objection.js**. Jika ada pertanyaan atau butuh penyesuaian, silakan tanyakan! 🚀
