/**
 * Test Suite: Products API Tests
 *
 * Tags: @master @sanity @api
 *
 * Covers:
 * - Get all products
 * - Get product by ID
 * - Get products with limit
 * - Sort products ascending
 * - Sort products descending
 * - Get all categories
 * - Get products by category
 * - Product CRUD (create, update, delete)
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
const LIMIT = Number(process.env.LIMIT ?? 3);

test.describe('Products API Tests', () => {

    // ---------------------------------------------------------
    // GET - All Products
    // ---------------------------------------------------------

    test('GET - All Products @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);

        const product = responseBody[0];
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('title');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('image');
    });

    // ---------------------------------------------------------
    // GET - Product by ID
    // ---------------------------------------------------------

    test('GET - Product by ID @master @sanity @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`;
        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const product = await response.json();

        expect(product.id).toBe(PRODUCT_ID);
        expect(product).toHaveProperty('title');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('image');
        expect(product).toHaveProperty('rating');
    });

    // ---------------------------------------------------------
    // GET - Products with Limit
    // ---------------------------------------------------------

    test('GET - Products with Limit @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;
        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Sort Products Ascending
    // ---------------------------------------------------------

    test('GET - Sort Products Ascending @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc')}`;
        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const products = await response.json();

        expect(Array.isArray(products)).toBeTruthy();
        expect(products.length).toBeGreaterThan(0);

        const ids = products.map((p: any) => p.id);
        for (let i = 1; i < ids.length; i++) {
            expect(ids[i]).toBeGreaterThanOrEqual(ids[i - 1]);
        }
    });

    // ---------------------------------------------------------
    // GET - Sort Products Descending
    // ---------------------------------------------------------

    test('GET - Sort Products Descending @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc')}`;
        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const products = await response.json();

        expect(Array.isArray(products)).toBeTruthy();
        expect(products.length).toBeGreaterThan(0);

        const ids = products.map((p: any) => p.id);
        for (let i = 1; i < ids.length; i++) {
            expect(ids[i]).toBeLessThanOrEqual(ids[i - 1]);
        }
    });

    // ---------------------------------------------------------
    // GET - All Categories
    // ---------------------------------------------------------

    test('GET - All Categories @master @regression @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);

        expect(response.status()).toBe(200);

        const categories = await response.json();

        expect(Array.isArray(categories)).toBeTruthy();
        expect(categories.length).toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - Products by Category
    // ---------------------------------------------------------

    test('GET - Products by Category @master @regression @api', async ({ request }) => {
        const category = 'electronics';
        const url = `${BASE_URL}${Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', category)}`;
        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const products = await response.json();

        expect(Array.isArray(products)).toBeTruthy();
        expect(products.length).toBeGreaterThan(0);

        products.forEach((product: any) => {
            expect(product.category).toBe(category);
        });
    });

    // ---------------------------------------------------------
    // POST - Create Product
    // ---------------------------------------------------------

    test('POST - Create Product @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateProductPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });

        expect(response.status()).toBe(200);

        const created = await response.json();

        expect(created).toHaveProperty('id');
        expect(created.title).toBe(payload.title);
        expect(Number(created.price)).toBe(payload.price);
    });

    // ---------------------------------------------------------
    // PUT - Update Product
    // ---------------------------------------------------------

    test('PUT - Update Product @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUpdatedProductPayload();
        const url = `${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`;

        const response = await request.put(url, { data: payload });

        expect(response.status()).toBe(200);

        const updated = await response.json();

        expect(updated.id).toBe(PRODUCT_ID);
        expect(updated.title).toBe(payload.title);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Product
    // ---------------------------------------------------------

    test('DELETE - Delete Product @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`;

        const response = await request.delete(url);

        expect(response.status()).toBe(200);
    });
});