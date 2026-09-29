/**
 * Test Suite: JSON Schema Validation Tests
 *
 * Tags: @master @regression @api
 *
 * Covers:
 * - Product response schema validation
 * - User response schema validation
 * - Cart response schema validation
 */

import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';
import Ajv from 'ajv';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
const USER_ID = Number(process.env.USER_ID ?? 1);
const CART_ID = Number(process.env.CART_ID ?? 1);

const ajv = new Ajv();

test.describe('JSON Schema Validation Tests', () => {

    // ---------------------------------------------------------
    // Product Response Schema
    // ---------------------------------------------------------

    test('Product Response Schema @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`;
        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const product = await response.json();

        const schema = DataProvider.readJson(path.resolve(__dirname, '../../api/schemas/product_api_schema.json'));
        const validate = ajv.compile(schema);
        const isValid = validate(product);

        if (!isValid) {
            console.log('Schema validation errors:', JSON.stringify(validate.errors, null, 2));
        }

        expect(isValid).toBeTruthy();
    });

    // ---------------------------------------------------------
    // User Response Schema
    // ---------------------------------------------------------

    test('User Response Schema @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`;
        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const user = await response.json();

        const schema = DataProvider.readJson(path.resolve(__dirname, '../../api/schemas/user_api_schema.json'));
        const validate = ajv.compile(schema);
        const isValid = validate(user);

        if (!isValid) {
            console.log('Schema validation errors:', JSON.stringify(validate.errors, null, 2));
        }

        expect(isValid).toBeTruthy();
    });

    // ---------------------------------------------------------
    // Cart Response Schema
    // ---------------------------------------------------------

    test('Cart Response Schema @master @regression @api', async ({ request }) => {
        const url = `${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`;
        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const cart = await response.json();

        const schema = DataProvider.readJson(path.resolve(__dirname, '../../api/schemas/cart_api_schema.json'));
        const validate = ajv.compile(schema);
        const isValid = validate(cart);

        if (!isValid) {
            console.log('Schema validation errors:', JSON.stringify(validate.errors, null, 2));
        }

        expect(isValid).toBeTruthy();
    });
});