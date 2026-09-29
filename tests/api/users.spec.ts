/**
 * Test Suite: Users API Tests
 *
 * Tags: @master @sanity @api
 *
 * Covers:
 * - Get all users
 * - Get user by ID
 * - Get users with limit
 * - Sort users ascending and descending
 * - User CRUD (create, update, delete)
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
const USER_ID = Number(process.env.USER_ID ?? 1);
const LIMIT = Number(process.env.LIMIT ?? 3);

test.describe('Users API Tests', () => {

    // ---------------------------------------------------------
    // GET - All Users
    // ---------------------------------------------------------

    test('GET - All Users @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);

        expect(response.status()).toBe(200);

        const users = await response.json();

        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length).toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - User by ID
    // ---------------------------------------------------------

    test('GET - User by ID @master @sanity @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`;
        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const user = await response.json();

        expect(user.id).toBe(USER_ID);
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('address');
        expect(user).toHaveProperty('phone');
    });

    // ---------------------------------------------------------
    // GET - Users with Limit
    // ---------------------------------------------------------

    test('GET - Users with Limit @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_USERS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;
        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const users = await response.json();

        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Sort Users Ascending
    // ---------------------------------------------------------

    test('GET - Sort Users Ascending @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'asc')}`;
        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const users = await response.json();

        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length).toBeGreaterThan(0);

        const ids = users.map((u: any) => u.id);
        for (let i = 1; i < ids.length; i++) {
            expect(ids[i]).toBeGreaterThanOrEqual(ids[i - 1]);
        }
    });

    // ---------------------------------------------------------
    // GET - Sort Users Descending
    // ---------------------------------------------------------

    test('GET - Sort Users Descending @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'desc')}`;
        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const users = await response.json();

        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length).toBeGreaterThan(0);

        const ids = users.map((u: any) => u.id);
        for (let i = 1; i < ids.length; i++) {
            expect(ids[i]).toBeLessThanOrEqual(ids[i - 1]);
        }
    });

    // ---------------------------------------------------------
    // POST - Create User
    // ---------------------------------------------------------

    test('POST - Create User @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUserPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });

        expect(response.status()).toBe(200);

        const created = await response.json();

        expect(created).toHaveProperty('id');
        expect(created.email).toBe(payload.email);
        expect(created.username).toBe(payload.username);
    });

    // ---------------------------------------------------------
    // PUT - Update User
    // ---------------------------------------------------------

    test('PUT - Update User @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUserUpdatePayload();
        const url = `${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(USER_ID))}`;

        const response = await request.put(url, { data: payload });

        expect(response.status()).toBe(200);

        const updated = await response.json();

        expect(updated.id).toBe(USER_ID);
        expect(updated.email).toBe(payload.email);
        expect(updated.username).toBe(payload.username);
    });

    // ---------------------------------------------------------
    // DELETE - Delete User
    // ---------------------------------------------------------

    test('DELETE - Delete User @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(USER_ID))}`;

        const response = await request.delete(url);

        expect(response.status()).toBe(200);
    });
});