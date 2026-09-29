/**
 * Test Suite: Authentication API Tests
 *
 * Tags: @master @sanity @api
 *
 * Covers:
 * - Successful login
 * - Invalid login
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;

test.describe('Authentication API Tests', () => {

    // ---------------------------------------------------------
    // POST - Successful Login
    // ---------------------------------------------------------

    test('POST - Successful Login @master @sanity @api', async ({ request }) => {
        const payload = {
            username: process.env.USERNAME || 'mor_2314',
            password: process.env.PASSWORD || '83r5^_',
        };

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, { data: payload });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody).toHaveProperty('token');
        expect(typeof responseBody.token).toBe('string');
        expect(responseBody.token.length).toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // POST - Invalid Login
    // ---------------------------------------------------------

    test('POST - Invalid Login @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateInvalidLoginPayload();

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, { data: payload });

        expect(response.status()).toBe(401);

        const responseBody = await response.json();

        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toBe('username or password is incorrect');
    });
});