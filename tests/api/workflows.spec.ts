/**
 * Test Suite: End-to-End API CRUD Workflows
 *
 * Tags: @master @end-to-end @regression @api
 *
 * Covers:
 * - Product CRUD workflow (create → update → delete)
 * - User CRUD workflow (create → update → delete)
 * - Cart CRUD workflow (create → update → delete)
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
const USER_ID = Number(process.env.USER_ID ?? 1);

test.describe.serial('End-to-End API CRUD Workflows', () => {

    // ---------------------------------------------------------
    // Product CRUD Workflow
    // ---------------------------------------------------------

    test('Product CRUD Workflow @master @end-to-end @regression @api', async ({ request }) => {
        // 1) Create a product
        const createPayload = RandomDataUtil.generateProductPayload();
        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: createPayload });

        expect(createResponse.status()).toBe(200);

        const created = await createResponse.json();
        expect(created).toHaveProperty('id');

        const productId = created.id;

        // 2) Update the same product
        const updatePayload = RandomDataUtil.generateUpdatedProductPayload();
        const updateUrl = `${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(productId))}`;
        const updateResponse = await request.put(updateUrl, { data: updatePayload });

        expect(updateResponse.status()).toBe(200);

        const updated = await updateResponse.json();
        expect(updated.title).toBe(updatePayload.title);

        // 3) Delete the same product
        const deleteUrl = `${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(productId))}`;
        const deleteResponse = await request.delete(deleteUrl);

        expect(deleteResponse.status()).toBe(200);
    });

    // ---------------------------------------------------------
    // User CRUD Workflow
    // ---------------------------------------------------------

    test('User CRUD Workflow @master @end-to-end @regression @api', async ({ request }) => {
        // 1) Create a user
        const createPayload = RandomDataUtil.generateUserPayload();
        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: createPayload });

        expect(createResponse.status()).toBe(200);

        const created = await createResponse.json();
        expect(created).toHaveProperty('id');

        const userId = created.id;

        // 2) Update the same user
        const updatePayload = RandomDataUtil.generateUserUpdatePayload();
        const updateUrl = `${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(userId))}`;
        const updateResponse = await request.put(updateUrl, { data: updatePayload });

        expect(updateResponse.status()).toBe(200);

        const updated = await updateResponse.json();
        expect(updated.email).toBe(updatePayload.email);
        expect(updated.username).toBe(updatePayload.username);

        // 3) Delete the same user
        const deleteUrl = `${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(userId))}`;
        const deleteResponse = await request.delete(deleteUrl);

        expect(deleteResponse.status()).toBe(200);
    });

    // ---------------------------------------------------------
    // Cart CRUD Workflow
    // ---------------------------------------------------------

    test('Cart CRUD Workflow @master @end-to-end @regression @api', async ({ request }) => {
        // 1) Create a cart
        const createPayload = RandomDataUtil.generateCartPayload(USER_ID);
        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: createPayload });

        expect(createResponse.status()).toBe(200);

        const created = await createResponse.json();
        expect(created).toHaveProperty('id');
        expect(created.userId).toBe(USER_ID);
        expect(created.products).toBeDefined();

        const cartId = created.id;

        // 2) Update the same cart
        const updatePayload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
        const updateUrl = `${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(cartId))}`;
        const updateResponse = await request.put(updateUrl, { data: updatePayload });

        expect(updateResponse.status()).toBe(200);

        const updated = await updateResponse.json();
        expect(updated.id).toBe(cartId);

        // 3) Delete the same cart
        const deleteUrl = `${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(cartId))}`;
        const deleteResponse = await request.delete(deleteUrl);

        expect(deleteResponse.status()).toBe(200);
    });
});