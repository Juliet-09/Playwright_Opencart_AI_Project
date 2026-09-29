/**
 * Test Suite: Carts API Tests
 *
 * Tags: @master @sanity @api
 *
 * Covers:
 * - Get all carts
 * - Get cart by ID
 * - Get carts by date range
 * - Get user cart
 * - Get carts with limit
 * - Sort carts ascending and descending
 * - Cart CRUD (create, update, delete)
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
const CART_ID = Number(process.env.CART_ID ?? 1);
const USER_ID = Number(process.env.USER_ID ?? 1);
const LIMIT = Number(process.env.LIMIT ?? 3);
const START_DATE = process.env.START_DATE || '2019-12-10';
const END_DATE = process.env.END_DATE || '2020-10-10';

test.describe('Carts API Tests', () => {

    // ---------------------------------------------------------
    // GET - All Carts
    // ---------------------------------------------------------

    test('GET - All Carts @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);

        expect(response.status()).toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts)).toBeTruthy();
        expect(carts.length).toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - Cart by ID
    // ---------------------------------------------------------

    test('GET - Cart by ID @master @sanity @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`;
        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const cart = await response.json();

        expect(cart.id).toBe(CART_ID);
        expect(cart).toHaveProperty('userId');
        expect(cart).toHaveProperty('date');
        expect(cart).toHaveProperty('products');
        expect(Array.isArray(cart.products)).toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Carts by Date Range
    // ---------------------------------------------------------

    test('GET - Carts by Date Range @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_CARTS_BY_DATE_RANGE
            .replace('{startdate}', START_DATE)
            .replace('{enddate}', END_DATE)}`;
        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts)).toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - User Cart
    // ---------------------------------------------------------

    test('GET - User Cart @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_USER_CART.replace('{userId}', String(USER_ID))}`;
        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts)).toBeTruthy();

        if (carts.length > 0) {
            carts.forEach((cart: any) => {
                expect(cart.userId).toBe(USER_ID);
            });
        }
    });

    // ---------------------------------------------------------
    // GET - Carts with Limit
    // ---------------------------------------------------------

    test('GET - Carts with Limit @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;
        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts)).toBeTruthy();
        expect(carts.length).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Sort Carts Ascending
    // ---------------------------------------------------------

    test('GET - Sort Carts Ascending @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'asc')}`;
        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts)).toBeTruthy();
        expect(carts.length).toBeGreaterThan(0);

        const ids = carts.map((c: any) => c.id);
        for (let i = 1; i < ids.length; i++) {
            expect(ids[i]).toBeGreaterThanOrEqual(ids[i - 1]);
        }
    });

    // ---------------------------------------------------------
    // GET - Sort Carts Descending
    // ---------------------------------------------------------

    test('GET - Sort Carts Descending @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'desc')}`;
        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const carts = await response.json();

        expect(Array.isArray(carts)).toBeTruthy();
        expect(carts.length).toBeGreaterThan(0);

        const ids = carts.map((c: any) => c.id);
        for (let i = 1; i < ids.length; i++) {
            expect(ids[i]).toBeLessThanOrEqual(ids[i - 1]);
        }
    });

    // ---------------------------------------------------------
    // POST - Create Cart
    // ---------------------------------------------------------

    test('POST - Create Cart @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateCartPayload(USER_ID);

        const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });

        expect(response.status()).toBe(200);

        const created = await response.json();

        expect(created).toHaveProperty('id');
        expect(created.userId).toBe(USER_ID);
        expect(created.products).toBeDefined();
        expect(Array.isArray(created.products)).toBeTruthy();
    });

    // ---------------------------------------------------------
    // PUT - Update Cart
    // ---------------------------------------------------------

    test('PUT - Update Cart @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
        const url = `${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(CART_ID))}`;

        const response = await request.put(url, { data: payload });

        expect(response.status()).toBe(200);

        const updated = await response.json();

        expect(updated.id).toBe(CART_ID);
        expect(updated.userId).toBe(USER_ID);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Cart
    // ---------------------------------------------------------

    test('DELETE - Delete Cart @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(CART_ID))}`;

        const response = await request.delete(url);

        expect(response.status()).toBe(200);
    });
});