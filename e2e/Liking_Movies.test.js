/* Langkah-langkah tes menyukai film
	1. Buka halaman utama.
	2. Pilih salah satu film. Misalnya film pertama.
	3. Klik film tersebut.
	4. Aplikasi membawa user ke halaman detail film.
	5. Kita menekan tombol menyukai film.
	6. Kita buka halaman daftar film yang disukai.
	7. Kita melihat satu film yang telah disukai.
*/

/* Langkah-langkah tes pencarian film yang disukai
	1. Pastikan belum ada film yang disukai.
	2. Buka halaman utama.
	3. Pilih tiga film untuk disukai.
	4. Buka halaman daftar film yang disukai.
	5. Pastikan tiga film di atas ditampilkan.
	6. Lakukan pencarian terhadap salah satu film.
	7. Pastikan hasil pencarian film benar.
		- Jumlah film sesuai.
		- Judul film sesuai.
*/

const assert = require('assert');

Feature('Liking Movies');

Before(({ I }) => {
	I.amOnPage('/#/like');
});

/* Tes jika tidak ada film yang disukai */
Scenario('showing empty liked movies', ({ I }) => {
	I.seeElement('#query');

	I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');
});
/* End tes jika tidak ada film yang disukai */

/* Tes film disukai */
Scenario('liking one movie', async ({ I }) => {
	I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');

	I.amOnPage('/');

	I.seeElement('.movie__title a');
	const firstMovie = locate('.movie__title a').first();
	const firstMovieTitle = await I.grabTextFrom(firstMovie);
	I.click(firstMovie);

	I.seeElement('#likeButton');
	I.click('#likeButton');

	I.amOnPage('/#/like');
	I.seeElement('.movie-item');
	const likedMovieTitle = await I.grabTextFrom('.movie__title');

	assert.strictEqual(firstMovieTitle, likedMovieTitle); // Menentukan apakah judul film yang disukai sama seperti judul film yang ada di halaman utama
});
/* End tes film disukai */

/* Tes pencarian film yang disukai */
Scenario('searching movies', async ({ I }) => {
	I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');

	I.amOnPage('/');

	I.seeElement('.movie__title a');

	const titles = [];
	for (let i = 1; i <= 3; i++) {
		I.click(locate('.movie__title a').at(i));

		I.seeElement('#likeButton');
		I.click('#likeButton');

		titles.push(await I.grabTextFrom('.movie__title'));

		I.amOnPage('/');
	}

	I.amOnPage('/#/like');
	I.seeElement('#query');

	const visibleLikedMovie = await I.grabNumberOfVisibleElements('.movie-item');
	assert.strictEqual(titles.length, visibleLikedMovie); // Memastikan bahwa jumlah film yang disukai ditampilkan dengan jumlah yang benar (3 judul film)

	const searchQuery = titles[1].substring(1, 3);

	I.fillField('#query', searchQuery);
	I.pressKey('Enter');

	// Mendapatkan daftar film yang sesuai dengan searchQuery
	const matchingMovies = titles.filter(
		title => title.indexOf(searchQuery) !== -1
	);
	const visibleSearchedLikedMovies = await I.grabNumberOfVisibleElements(
		'.movie-item'
	); // Mengambil jumlah elemen film yang muncul

	assert.strictEqual(matchingMovies.length, visibleSearchedLikedMovies); // Memastikan jumlah film yang muncul benar

	for (let i = 0; i < matchingMovies.length; i++) {
		const visibleTitle = await I.grabTextFrom(
			locate('.movie__title').at(i + 1)
		);

		assert.strictEqual(matchingMovies[i], visibleTitle); // Memastikan judul-judul film yang diperolah sesuai
	}
});
/* End tes pencarian film yang disukai */
