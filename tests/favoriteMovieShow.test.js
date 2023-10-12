/* Skenario Menampilkan Daftar Film
 * 1. Buka halaman daftar film yang disukai.
 * 2. Tampilkan semua film yang disukai.
 *    a. Presenter meminta semua daftar film yang disukai kepada Model. (Done)
 *    b. Model mengembalikan daftar film. (Done)
 *    c. Presenter meminta View menampilkan daftar film. (Done)
 *
 * 3. Bila tidak ada film yang disukai, berikan informasi mengenai kondisi tersebut.
 *    a. Presenter meminta semua daftar film yang disukai kepada Model. (Done)
 *    b. Model mengembalikan daftar kosong. (Done)
 *    c. Presenter meminta View menampilkan informasi bahwa belum ada film yang disukai. (Done)
 */

import FavoriteMovieShowPresenter from '../src/scripts/views/pages/liked-movies/favorite-movie-show-presenter';
import FavoriteMovieView from '../src/scripts/views/pages/liked-movies/favorite-movie-view';

describe('Showing all favorite movies', () => {
	let view;

	const renderTemplate = () => {
		view = new FavoriteMovieView();
		document.body.innerHTML = view.getTemplate();
	};

	beforeEach(() => {
		renderTemplate();
	});

	describe('When no movies have been liked', () => {
		/* 3. a. Tes presenter meminta semua daftar film yang disukai kepada Model */
		it('should ask for the favorite movies', () => {
			const favoriteMovies = {
				getAllMovies: jest.fn().mockImplementation(() => []),
			};

			new FavoriteMovieShowPresenter({
				view,
				favoriteMovies,
			});

			expect(favoriteMovies.getAllMovies).toHaveBeenCalledTimes(1);
		});
		/* 3. a. End tes presenter meminta semua daftar film yang disukai kepada Model */

		/* 3. b. Tes model mengembalikan daftar kosong */
		it('should show the information that no movies have been liked', done => {
			document
				.getElementById('movies')
				.addEventListener('movies:updated', () => {
					expect(
						document.querySelectorAll('.movie-item__not__found').length
					).toEqual(1);

					done();
				});

			const favoriteMovies = {
				getAllMovies: jest.fn().mockImplementation(() => []),
			};

			new FavoriteMovieShowPresenter({
				view,
				favoriteMovies,
			});
		});
		/* 3. b. End tes model mengembalikan daftar kosong */
	});

	describe('When favorite movies exist', () => {
		/* 2. a. Tes presenter meminta semua daftar film yang disukai kepada Model */
		it('should show the movies', done => {
			document
				.getElementById('movies')
				.addEventListener('movies:updated', () => {
					expect(document.querySelectorAll('.movie-item').length).toEqual(2);

					done();
				});

			const favoriteMovies = {
				getAllMovies: jest.fn().mockImplementation(() => [
					{
						id: 11,
						title: 'A',
						vote_average: 3,
						overview: 'Sebuah film A',
					},
					{
						id: 22,
						title: 'B',
						vote_average: 4,
						overview: 'Sebuah film B',
					},
				]),
			};

			new FavoriteMovieShowPresenter({
				view,
				favoriteMovies,
			});
		});
		/* 2. a. End tes presenter meminta semua daftar film yang disukai kepada Model */
	});
});
