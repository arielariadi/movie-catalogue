/* Skenario Mencari Film.
 * 1. Pengguna memasukkan judul film yang dicari. (Done)
 * 2. Film yang dicari ditampilkan. (Done)
 *    a. Bila film tidak ada, tampilkan informasi bahwa tidak ada film yang ditemukan. (Done)
 */

/* Usecase dan Spesifikasinya
 * 1. Posibilitas bila pengguna memasukkan kueri pencarian “film A”. (Done)
 *    a. Presenter akan meminta ke Model untuk memberikan film yang disukai berdasarkan pencarian. (Done)
 *    b. Presenter akan menampilkan ke View (DOM) semua film yang dikembalikan oleh Model. (Done)
 * 			Spesifikasi Tes 1 b:
 * 			1. Presenter meminta FavoriteMovies mencari fillm. (Done)
 * 			2. Presenter menerima film hasil pencarian. (done)
 * 			3. Presenter menampilkan film hasil pencarian. (Done)
 *
 * 2. Posibilitas bila pengguna memasukkan kueri pencarian kosong seperti “”, “ “, atau tab. (Done)
 *    a. Presenter akan meminta Model untuk memberikan semua film yang disukai. (Done)
 *    b. Presenter akan menampilkan ke View semua film yang disukai yang telah diberikan oleh Model. (Done)
 *
 * 3. Posibilitas bila pengguna memasukkan kueri pencarian dan tidak ada film yang cocok. (Done)
 *    a. Presenter meminta Model untuk mencari film. (Done)
 *    b. Presenter akan menampilkan informasi tidak ada film yang ditemukan pada View. (Done)
 */

/* TODO:
 * 1. Meringkas kode untuk mempersiapkan tes (Done)
 */

/* TODO Tambahan:
 * 1. Menyesuaikan template hasil pencarian agar dapat menggunakan template menampilkan daftar film yang disukai. (Done)
 * 2. Mengharmoniskan kedua method yang menampilkan daftar film yang disukai, yaitu showFavoriteMovies dan showMovies. (Done)
 * 3. Mengubah nama FavoriteMovieSearchView agar lebih general. (Done)
 */

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import FavoriteMovieSearchPresenter from '../src/scripts/views/pages/liked-movies/favorite-movie-search-presenter';
import FavoriteMovieIdb from '../src/scripts/data/favorite-movie-idb';
import FavoriteMovieView from '../src/scripts/views/pages/liked-movies/favorite-movie-view';

describe('Searching movies', () => {
	let presenter;
	let favoriteMovies;
	let view;

	const searchMovies = query => {
		const queryElement = document.getElementById('query');
		queryElement.value = query;

		queryElement.dispatchEvent(new Event('change'));
	};

	const setMovieSearchContainer = () => {
		view = new FavoriteMovieView();
		document.body.innerHTML = view.getTemplate();
	};

	const constructPresenter = () => {
		favoriteMovies = {
			getAllMovies: jest.fn(),
			searchMovies: jest.fn(),
		};
		presenter = new FavoriteMovieSearchPresenter({
			favoriteMovies,
			view,
		});
	};

	beforeEach(() => {
		setMovieSearchContainer();
		constructPresenter();
	});

	describe('When Query is not empty', () => {
		it('should be able to capture the query typed by the user', () => {
			favoriteMovies.searchMovies.mockImplementation(() => []);

			searchMovies('film a');

			expect(presenter.latestQuery).toEqual('film a');
		});

		/* 1. a. Tes presenter akan meminta ke Model untuk memberikan film yang disukai berdasarkan pencarian */
		it('should ask the model to search for liked movies', () => {
			favoriteMovies.searchMovies.mockImplementation(() => []);

			searchMovies('film a');

			expect(favoriteMovies.searchMovies).toHaveBeenCalledWith('film a');
		});
		/* 1. a. End tes presenter akan meminta ke Model untuk memberikan film yang disukai berdasarkan pencarian */

		/* 1. b. Tes presenter akan menampilkan ke View (DOM) semua film yang dikembalikan oleh Model */
		it('should show the movies found by Favorite Movies', done => {
			document
				.getElementById('movies')
				.addEventListener('movies:updated', () => {
					expect(document.querySelectorAll('.movie-item').length).toEqual(3);

					done();
				});

			favoriteMovies.searchMovies.mockImplementation(query => {
				if (query === 'film a') {
					return [
						{ id: 111, title: 'film abc' },
						{ id: 222, title: 'ada juga film abcde' },
						{ id: 333, title: 'ini juga boleh film a' },
					];
				}
				return [];
			});

			searchMovies('film a');
		});

		it('should show the name of the movies found by Favorite Movies', done => {
			document
				.getElementById('movies')
				.addEventListener('movies:updated', () => {
					const movieTitles = document.querySelectorAll('.movie__title');
					expect(movieTitles.item(0).textContent).toEqual('film abc');
					expect(movieTitles.item(1).textContent).toEqual(
						'ada juga film abcde'
					);
					expect(movieTitles.item(2).textContent).toEqual(
						'ini juga boleh film a'
					);
					done();
				});

			favoriteMovies.searchMovies.mockImplementation(query => {
				if (query === 'film a') {
					return [
						{ id: 111, title: 'film abc' },
						{ id: 222, title: 'ada juga film abcde' },
						{ id: 333, title: 'ini juga boleh film a' },
					];
				}
				return [];
			});

			searchMovies('film a');
		});

		it('should show - when the movie returned does not contain a title', done => {
			document
				.getElementById('movies')
				.addEventListener('movies:updated', () => {
					const movieTitles = document.querySelectorAll('.movie__title');
					expect(movieTitles.item(0).textContent).toEqual('-');

					done();
				});

			favoriteMovies.searchMovies.mockImplementation(query => {
				if (query === 'film a') {
					return [{ id: 444 }];
				}

				return [];
			});

			searchMovies('film a');
		});
		/* 1. b. End tes presenter akan menampilkan ke View (DOM) semua film yang dikembalikan oleh Model */
	});

	describe('When query is empty', () => {
		/* 2. b. Tes Presenter akan meminta Model untuk memberikan semua film yang disukai */
		it('should capture the query as empty', () => {
			favoriteMovies.getAllMovies.mockImplementation(() => []);

			searchMovies(' ');
			expect(presenter.latestQuery.length).toEqual(0);

			searchMovies('    ');
			expect(presenter.latestQuery.length).toEqual(0);

			searchMovies('');
			expect(presenter.latestQuery.length).toEqual(0);

			searchMovies('\t');
			expect(presenter.latestQuery.length).toEqual(0);
		});

		it('should show all favorite movies', () => {
			favoriteMovies.getAllMovies.mockImplementation(() => []);

			searchMovies('    ');

			expect(favoriteMovies.getAllMovies).toHaveBeenCalled();
		});

		/* 2. b. End tes Presenter akan meminta Model untuk memberikan semua film yang disukai */
	});

	describe('When no favorite movies could be found', () => {
		/* 3. b. Tes presenter akan menampilkan informasi tidak ada film yang ditemukan pada View */
		it('should show the empty message', done => {
			document
				.getElementById('movies')
				.addEventListener('movies:updated', () => {
					expect(
						document.querySelectorAll('.movie-item__not__found').length
					).toEqual(1);
					done();
				});

			favoriteMovies.searchMovies.mockImplementation(query => []);
			searchMovies('film a');
		});

		it('should not show any movie', done => {
			document
				.getElementById('movies')
				.addEventListener('movies:updated', () => {
					expect(document.querySelectorAll('.movie-item').length).toEqual(0);

					done();
				});

			favoriteMovies.searchMovies.mockImplementation(query => []);

			searchMovies('film a');
		});

		/* 3. b. End tes presenter akan menampilkan informasi tidak ada film yang ditemukan pada View */
	});
});
