/* TODO Batal Menyukai Film:
 * 1. Film sudah disukai. (Done)
 * 2. Widget untuk batal menyukai film ditampilkan. (Done)
 * 3. Widget pembatalan ditekan oleh pengguna. (Done)
 * 4. Film dihapus dari daftar film yang disukai. (Done)
 *    a. Film berhasil dihapus (Done)
 *    b. Ternyata film tidak ada dalam daftar film yang disukai. (Done)
 */

import FavoriteMovieIdb from '../src/scripts/data/favorite-movie-idb';
import * as TestFactories from './helpers/testFactories'; // template untuk object LikeButtonPresenter

describe('Unliking A Movie', () => {
	const addLikeButtonContainer = () => {
		document.body.innerHTML = '<div id="likeButtonContainer"></div>';
	};

	// Menambahkan movie ID 1 pada daftar film yang disukai sebelum setiap test case dijalankan
	beforeEach(async () => {
		addLikeButtonContainer();
		await FavoriteMovieIdb.putMovie({ id: 1 });
	});

	// Setelah setiap metode tes dijalankan, kita hapus movie ID 1 dari daftar tersebut
	afterEach(async () => {
		await FavoriteMovieIdb.deleteMovie(1);
	});

	/* 2. Tes widget untuk batal menyukai film ditampilkan */
	it('should display unlike widget when the movie has been liked', async () => {
		await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

		expect(
			document.querySelector('[aria-label="unlike this movie"]')
		).toBeTruthy();
	});

	it('should not display like widget when the movie has been liked', async () => {
		await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

		expect(
			document.querySelector('[aria-label="like this movie"]')
		).toBeFalsy();
	});
	/* 2. End tes widget untuk batal menyukai film ditampilkan */

	/* 3. Widget pembatalan ditekan oleh pengguna */
	it('should be able to remove liked movie from the list', async () => {
		await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

		document
			.querySelector('[aria-label="unlike this movie"]')
			.dispatchEvent(new Event('click'));

		expect(await FavoriteMovieIdb.getAllMovies()).toEqual([]);
	});
	/* 3. End widget pembatalan ditekan oleh pengguna */

	/* 4. Tes film dihapus dari daftar film yang disukai */
	it('should not throw error when user click unlike widget if the unliked movie is not in the list', async () => {
		await TestFactories.createLikeButtonPresenterWithMovie({ id: 1 });

		// Hapus dulu film dari daftar film yang disukai
		await FavoriteMovieIdb.deleteMovie(1);

		// Kemudia, simulasikan pengguna menekan widget batal menyukai film
		document
			.querySelector('[aria-label="unlike this movie"]')
			.dispatchEvent(new Event('click'));
		expect(await FavoriteMovieIdb.getAllMovies()).toEqual([]);
	});
	/* 4. End tes film dihapus dari daftar film yang disukai */
});
