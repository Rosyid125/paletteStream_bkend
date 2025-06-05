Anda sedang bekerja dalam proyek backend sebuah aplikasi sosial media berbasis web untuk berbagi gambar (anime, manga, dan ilustrasi). Aplikasi ini memiliki fitur **gamifikasi**, yang meliputi sistem:

- Pengalaman (EXP)
- Level
- Achievements (pencapaian)
- Challenges (tantangan)

### Arsitektur: MVC-SR (Model – View – Controller – Service – Repository)

Ikuti prinsip _Separation of Concern (SoC)_ secara ketat:

1. **Controller Layer**

   - Hanya menangani HTTP request dan response.
   - Tidak boleh langsung mengakses repository.
   - Harus memanggil _Service Layer_ untuk menjalankan logika.

2. **Service Layer**

   - Menangani seluruh logika bisnis.
   - Boleh memanggil beberapa service atau repository, tetapi tidak boleh menciptakan circular dependencies.
   - Bertanggung jawab untuk validasi, perhitungan EXP, penentuan pencapaian, dsb.

3. **Repository Layer**

   - Fokus pada akses ke database (query, insert, update, delete).
   - Tidak boleh mengandung logika bisnis.

4. **Model Layer**

   - Menyimpan representasi data dan relasi ORM.
   - Gunakan secara ketat untuk struktur data dan relasi antar entitas.

5. **View Layer**
   - Tidak digunakan secara langsung karena ini adalah backend API berbasis web (RESTful/JSON).

---

### 💡 Spesifikasi Penting:

- Semua **perubahan kode** harus mengikuti struktur MVC-SR.
- Pastikan tidak ada penggunaan langsung repository di controller.
- Jangan menulis logika bisnis di controller atau repository.
- Gunakan service untuk pemrosesan seperti: pemberian EXP, penyelesaian challenge, perhitungan level, validasi kepemilikan gambar, dsb.

---

### 📦 Database Context:

Copilot dapat membaca struktur database secara **real-time** dari file `.vscode/mcp.json`, melalui integrasi dengan **MCP Server**. Maka dari itu:

- **Gunakan database schema dari MCP** untuk memahami entitas, field, dan relasi.
- Jika membutuhkan informasi tentang nama tabel, kolom, atau tipe data, gunakan data dari MCP.
- Jangan mengasumsikan struktur database—gunakan yang aktual dari context MCP.

Contoh entitas penting (hanya sebagai petunjuk awal, lihat detailnya via MCP):

- `users` (id, username, exp, level)
- `posts` (id, user_id, image_url, tags, like_count)
- `achievements` (id, name, description, unlock_condition)
- `user_achievements` (user_id, achievement_id, unlocked_at)
- `challenges`, `user_challenges`, `follows`, `likes`, dll.

---

### ⚠️ Penting:

- Jangan buat kode yang redundant.
- Refactor kode agar lebih efektif, ringkas, dan readable.
- Gunakan dependency injection dan interface jika diperlukan untuk menjaga fleksibilitas layer.
