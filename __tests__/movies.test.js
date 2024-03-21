import {test} from 'vitest';
import expect from "expect";

test('GET request to /api/movies returns list of movies', async ({ fetch }) => {
    const response = await fetch('/api/movies', { method: 'GET' });
    const movies = await response.json();

    expect(response.status).toBe(200);
    expect(movies).toEqual([{ id: 1, title: 'Movie 1' }, { id: 2, title: 'Movie 2' }]);
});

test('POST request à /api/movies adds a new movie', async ({ fetch }) => {
    const response = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: 'new Movie',
            plot: 'new movie',
            year: 2024,
            poster: 'poster_url',
        }),
    });

    const responseData = await response.json();

    expect(response.status).toBe(201);
    expect(responseData).toEqual({ status: 201, message: 'Film ajouté avec succès.' });
});
