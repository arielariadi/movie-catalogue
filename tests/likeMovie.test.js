/* TODO Menyukai Film:
 * 1. Film belum disukai. (Done)
 * 2. Widget untuk menyukai film ditampilkan. (Done)
 * 3. Widget menyukai film ditekan oleh pengguna. (Done)
 * 4. Film ditambahkan ke daftar film yang disukai.
 *    a. Film berhasil ditambahkan. (Done)
 *    b. Ternyata film sudah disukai. (Done)
 *       i. Tidak perlu menyimpan kembali. (Done)
 *    c. Data film tidak memiliki ID.
 *       i. Sistem tidak memproses penyimpanan.
 *       ii. Sistem tidak gagal.
 */

/* TODO Tambahan
 * 1. Memberi nama yang lebih berbeda untuk createLikeButtonTemplate dan createLikedButtonTemplate, menjadi createLikeMovieButtonTemplate dan createUnlikeMovieButtonTemplate (Done)
 * 2. Alur negatif: sistem tidak memproses penyimpanan dan menyebabkan kegagalan jika menyimpan movie tanpa ID. (Done. Permasalahannya ada di method putMovie di file favorite-movie-idb.js)
 */

import FavoriteMovieIdb from '../src/scripts/data/favorite-movie-idb';
import * as TestFactories from './helpers/testFactories'; // template untuk object LikeButtonPresenter

describe('Liking A Movie', () => {
	/* 2. Tes widget untuk menyukai film ditampilkan */
	const addLikeButtonContainer = () => {
		document.body.innerHTML = '<div id="likeButtonContainer"></div>';
	};

	// Fungsi yang dijalankan sebelum setiap test case dijalan
	beforeEach(() => {
		addLikeButtonContainer();
	});

	it('should show the like button when the movie has not been liked before', async () => {
		await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

		expect(
			document.querySelector('[aria-label="like this movie"]')
		).toBeTruthy();
	});

	it('should not show the unlike button when the movie has not been liked before', async () => {
		await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

		expect(
			document.querySelector('[aria-label="unlike this movie"]')
		).toBeFalsy();
	});
	/* 2. End tes widget untuk menyukai film ditampilkan */

	/* 3. Tes widget menyukai film ditekan oleh pengguna */
	it('should be able to like the movie', async () => {
		await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

		document.querySelector('#likeButton').dispatchEvent(new Event('click'));

		// Memastikan film berhasil disukai (TODO 4.a)
		const movie = await FavoriteMovieIdb.getMovie(1);
		expect(movie).toEqual({ id: 1 });

		// Menghapus film yang ada di idb dengan id 1 karena bisa merusak tes kedua
		await FavoriteMovieIdb.deleteMovie(1);
	});
	/* 3. End tes widget menyukai film ditekan oleh pengguna */

	/* 4. b. Tes ternyata film sudah disukai */
	it('should not add a movie again when its already liked', async () => {
		await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });
		// Tambahkan film dengan ID 1 ke daftar film yang disukai
		await FavoriteMovieIdb.putMovie({ id: 1 });

		// Simulasikan pengguna menekan tombol suka film
		document.querySelector('#likeButton').dispatchEvent(new Event('click'));

		// Tidak ada film yang ganda
		expect(await FavoriteMovieIdb.getAllMovies()).toEqual([{ id: 1 }]);

		await FavoriteMovieIdb.deleteMovie(1);
	});
	/* 4. b. End tes ternyata film sudah disukai */

	/* 4. c. Tes data film tidak memiliki ID */
	it('should not add a movie when it has no id', async () => {
		await TestFactories.createLikeButtonPresenterWithMovie({});

		document.querySelector('#likeButton').dispatchEvent(new Event('click'));

		expect(await FavoriteMovieIdb.getAllMovies()).toEqual([]);
	});
	/* 4. c. End tes data film tidak memiliki ID */
});
